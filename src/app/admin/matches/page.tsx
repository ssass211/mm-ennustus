'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import styles from '../admin.module.css';
import { confirmMatchResultAndCalculatePoints } from '../actions';

export default function AdminMatchesPage() {
  const supabase = createClient();
  const { t, locale } = useI18n();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [supabase]);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        stage:stages(*)
      `)
      .order('match_datetime', { ascending: true });
    
    if (data) {
      setMatches(data);
    }
    setLoading(false);
  };

  const handleUpdateScore = async (matchId: string, homeScore: number, awayScore: number, status: string) => {
    setActionLoading(matchId);
    setMessage(null);

    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: status,
      })
      .eq('id', matchId);

    if (error) {
      setMessage({ type: 'error', text: 'Viga tulemuse salvestamisel: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Tulemus edukalt salvestatud!' });
      // Update local state instead of full refetch
      setMatches(matches.map(m => m.id === matchId ? { ...m, home_score: homeScore, away_score: awayScore, status } : m));
    }
    setActionLoading(null);
  };

  // Helper to handle manual form submission for a match row
  const onScoreSubmit = (e: React.FormEvent<HTMLFormElement>, matchId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const home = parseInt(formData.get('home_score') as string, 10);
    const away = parseInt(formData.get('away_score') as string, 10);
    const status = formData.get('status') as string;
    
    if (!isNaN(home) && !isNaN(away)) {
      handleUpdateScore(matchId, home, away, status);
    }
  };

  const handleConfirmResult = async (matchId: string) => {
    setActionLoading(matchId + '-confirm');
    setMessage(null);
    const res = await confirmMatchResultAndCalculatePoints(matchId);
    if (res.success) {
      setMessage({ type: 'success', text: 'Tulemus kinnitatud ja punktid arvutatud!' });
      setMatches(matches.map(m => m.id === matchId ? { ...m, is_result_confirmed: true } : m));
    } else {
      setMessage({ type: 'error', text: 'Viga: ' + res.error });
    }
    setActionLoading(null);
  };

  if (loading) {
    return <div className="spinner mx-auto mt-10" style={{ width: 40, height: 40 }} />;
  }

  return (
    <div>
      <h1 className="page-title mb-8">Mängude Haldus</h1>
      
      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-error'} mb-6 p-4 w-full block text-center text-lg`}>
          {message.text}
        </div>
      )}

      <div className={styles.adminCard}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Kõik mängud</h2>
          <button className="btn btn-secondary" onClick={fetchMatches}>
            🔄 Värskenda
          </button>
        </div>

        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b text-muted uppercase text-xs">Aeg</th>
                <th className="p-3 border-b text-muted uppercase text-xs">Mäng</th>
                <th className="p-3 border-b text-muted uppercase text-xs text-center">Staatus & Skoor</th>
                <th className="p-3 border-b text-muted uppercase text-xs text-center">Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b border-border hover:bg-surface-200 transition-colors">
                  <td className="p-3 text-sm">
                    {new Date(match.match_datetime).toLocaleString('et-EE', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                    <div className="text-xs text-muted mt-1">{match.stage.name_et}</div>
                  </td>
                  
                  <td className="p-3 font-semibold">
                    {match.home_team.name_et} <span className="text-muted mx-2">-</span> {match.away_team.name_et}
                  </td>
                  
                  <td className="p-3">
                    <form id={`form-${match.id}`} onSubmit={(e) => onScoreSubmit(e, match.id)} className="flex items-center justify-center gap-2">
                      <input 
                        type="number" 
                        name="home_score"
                        className="input text-center font-bold" 
                        style={{ width: '60px', padding: '4px' }}
                        defaultValue={match.home_score ?? ''}
                        min="0"
                      />
                      <span>:</span>
                      <input 
                        type="number" 
                        name="away_score"
                        className="input text-center font-bold" 
                        style={{ width: '60px', padding: '4px' }}
                        defaultValue={match.away_score ?? ''}
                        min="0"
                      />
                      <select 
                        name="status" 
                        className="input" 
                        style={{ padding: '4px', width: '110px' }}
                        defaultValue={match.status}
                      >
                        <option value="upcoming">Tulemas</option>
                        <option value="live">Live</option>
                        <option value="finished">Lõppenud</option>
                      </select>
                    </form>
                  </td>
                  
                  <td className="p-3 text-center">
                    <button 
                      type="submit" 
                      form={`form-${match.id}`}
                      className="btn btn-primary btn-sm"
                      disabled={actionLoading === match.id}
                    >
                      {actionLoading === match.id ? <span className="spinner" style={{width:16,height:16}}/> : 'Salvesta'}
                    </button>
                    
                    {match.status === 'finished' && !match.is_result_confirmed && (
                      <button 
                        className="btn btn-sm badge-success ml-2" 
                        onClick={() => handleConfirmResult(match.id)}
                        disabled={actionLoading === match.id + '-confirm'}
                      >
                        {actionLoading === match.id + '-confirm' ? 'Kinnitan...' : 'Kinnita tulemus'}
                      </button>
                    )}
                    {match.is_result_confirmed && (
                      <span className="badge badge-success ml-2">✅ Kinnitatud</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
