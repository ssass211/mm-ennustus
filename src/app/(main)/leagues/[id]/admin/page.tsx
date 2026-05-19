'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLeague } from '@/lib/LeagueContext';
import styles from '@/app/admin/admin.module.css';

export default function LeagueAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const { userLeagues } = useLeague();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({ question_et: '', question_en: '', max_points: 5, deadline: '' });

  const currentLeague = userLeagues.find(l => l.league_id === id);

  // Verify admin access
  useEffect(() => {
    const isLeagueAdmin = userLeagues.some(l => l.league_id === id && l.role === 'admin');
    if (!isLeagueAdmin && userLeagues.length > 0) {
      router.push('/leagues');
      return;
    }

    const fetchQuestions = async () => {
      const { data } = await supabase
        .from('special_questions')
        .select('*')
        .eq('league_id', id)
        .order('created_at', { ascending: false });
      
      if (data) setQuestions(data);
      setLoading(false);
    };

    if (userLeagues.length > 0) {
      fetchQuestions();
    }
  }, [id, userLeagues, supabase]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: tournament } = await supabase.from('tournaments').select('id').limit(1).single();

    const { data, error } = await supabase
      .from('special_questions')
      .insert({
        tournament_id: tournament?.id,
        league_id: id,
        question_et: newQuestion.question_et,
        question_en: newQuestion.question_en || newQuestion.question_et,
        max_points: newQuestion.max_points,
        deadline: new Date(newQuestion.deadline).toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      setQuestions([data, ...questions]);
      setNewQuestion({ question_et: '', question_en: '', max_points: 5, deadline: '' });
    }
    setLoading(false);
  };

  if (loading) return <div className="spinner mx-auto mt-10" style={{ width: 40, height: 40 }}></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title mb-0">Liiga Administraator</h1>
          {currentLeague && (
            <p className="text-muted mt-2">Liitumiskood: <strong className="text-white text-lg px-2 py-1 bg-surface-200 rounded">{currentLeague.leagues.join_code}</strong></p>
          )}
        </div>
        <Link href="/" className="btn btn-secondary">Tagasi avalehele</Link>
      </div>

      <div className={styles.adminCard + " mb-8"}>
        <h2 className="text-xl font-bold mb-4">Uus eriküsimus</h2>
        <form onSubmit={handleAddQuestion} className="grid gap-4">
          <div className="grid grid-2">
            <div className="input-group">
              <label className="input-label">Küsimus (ET)</label>
              <input type="text" className="input" required value={newQuestion.question_et} onChange={e => setNewQuestion({...newQuestion, question_et: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Küsimus (EN)</label>
              <input type="text" className="input" value={newQuestion.question_en} onChange={e => setNewQuestion({...newQuestion, question_en: e.target.value})} />
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="input-group">
              <label className="input-label">Max punktid</label>
              <input type="number" className="input" required min="1" value={newQuestion.max_points} onChange={e => setNewQuestion({...newQuestion, max_points: parseInt(e.target.value)})} />
            </div>
            <div className="input-group">
              <label className="input-label">Tähtaeg</label>
              <input type="datetime-local" className="input" required value={newQuestion.deadline} onChange={e => setNewQuestion({...newQuestion, deadline: e.target.value})} />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvestan...' : 'Salvesta küsimus'}
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title">Olemasolevad küsimused</h2>
      <div className="grid gap-4">
        {questions.length === 0 ? (
          <div className="text-center text-muted py-8">
            Ühtegi eriküsimust pole veel loodud.
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className={styles.adminCard} style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-1">{q.question_et}</h3>
                  <div className="text-sm text-muted">
                    Max {q.max_points}p • Tähtaeg: {new Date(q.deadline).toLocaleString('et-EE')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
