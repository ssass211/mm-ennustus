'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useLeague } from '@/lib/LeagueContext';

export default function LeagueManager() {
  const { userLeagues, refreshLeagues, setActiveLeague } = useLeague();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'my' | 'join' | 'create'>('my');
  const [joinCode, setJoinCode] = useState('');
  const [newLeagueName, setNewLeagueName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Find league by code
      const { data: league, error: findError } = await supabase
        .from('leagues')
        .select('*')
        .eq('join_code', joinCode)
        .single();

      if (findError || !league) {
        throw new Error('Liigat ei leitud selle koodiga');
      }

      // Join
      const { error: joinError } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'member',
          status: 'approved'
        });

      if (joinError) throw joinError;

      setMessage({ type: 'success', text: `Edukalt liitutud liigaga "${league.name}"!` });
      setJoinCode('');
      await refreshLeagues();
      setActiveTab('my');
      setActiveLeague(league);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Viga liitumisel' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: league, error: createError } = await supabase
        .from('leagues')
        .insert({
          name: newLeagueName,
          join_code: code,
          created_by: user.id
        })
        .select()
        .single();

      if (createError) throw createError;

      const { error: joinError } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'admin',
          status: 'approved'
        });

      if (joinError) throw joinError;

      setMessage({ type: 'success', text: `Liiga "${newLeagueName}" edukalt loodud! Liitumiskood: ${code}` });
      setNewLeagueName('');
      await refreshLeagues();
      setActiveTab('my');
      setActiveLeague(league);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Viga loomisel' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card mb-8">
      <h2 className="section-title mb-6">🏆 Ennustusliigad</h2>
      
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>Minu Liigad</button>
        <button className={`tab ${activeTab === 'join' ? 'active' : ''}`} onClick={() => setActiveTab('join')}>Liitu Liigaga</button>
        <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Loo Liiga</button>
      </div>

      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-error'} mb-6 p-4 block`} style={{ fontSize: '1rem' }}>
          {message.text}
        </div>
      )}

      {activeTab === 'my' && (
        <div className="grid gap-4">
          {userLeagues.length === 0 ? (
            <div className="text-center text-muted py-8">
              <p className="mb-4">Sa pole veel üheski liigas.</p>
              <div className="flex gap-4 justify-center">
                <button className="btn btn-primary" onClick={() => setActiveTab('join')}>Liitu koodiga</button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('create')}>Loo uus liiga</button>
              </div>
            </div>
          ) : (
            userLeagues.map((lm) => (
              <div key={lm.id} className="p-4 bg-surface-200 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{lm.leagues.name}</h3>
                  <div className="text-sm text-muted">
                    <span>Roll: {lm.role === 'admin' ? 'Admin' : 'Mängija'}</span>
                    {lm.role === 'admin' && <span> • Kood: <strong>{lm.leagues.join_code}</strong></span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {lm.role === 'admin' && (
                    <Link href={`/leagues/${lm.league_id}/admin`} className="btn btn-outline btn-sm">Halda</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'join' && (
        <div className="max-w-lg">
          <p className="text-muted mb-6">Sisesta sõbra antud 6-kohaline liitumiskood.</p>
          <form onSubmit={handleJoin}>
            <div className="input-group">
              <label className="input-label">Liitumiskood</label>
              <input type="text" className="input" placeholder="nt. X7B9KQ" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} required maxLength={10} />
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={loading || !joinCode}>{loading ? 'Liitun...' : 'Liitu Liigaga'}</button>
          </form>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-lg">
          <p className="text-muted mb-6">Loo oma seltskonnale privaatne liiga.</p>
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label className="input-label">Liiga Nimi</label>
              <input type="text" className="input" placeholder="nt. Pärnu poisid 2026" value={newLeagueName} onChange={(e) => setNewLeagueName(e.target.value)} required minLength={3} maxLength={50} />
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={loading || !newLeagueName}>{loading ? 'Loon...' : 'Loo Liiga'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
