'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import styles from '../admin.module.css';

export default function AdminQuestionsPage() {
  const supabase = createClient();
  const { t } = useI18n();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);

  // Form state
  const [qEt, setQEt] = useState('');
  const [qEn, setQEn] = useState('');
  const [points, setPoints] = useState('5');
  const [deadline, setDeadline] = useState('');
  const [tId, setTId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    
    const [qRes, tRes] = await Promise.all([
      supabase.from('special_questions').select('*').order('created_at', { ascending: false }),
      supabase.from('tournaments').select('id, name_et')
    ]);

    if (qRes.data) setQuestions(qRes.data);
    if (tRes.data) {
      setTournaments(tRes.data);
      if (tRes.data.length > 0) setTId(tRes.data[0].id);
    }
    
    setLoading(false);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('special_questions').insert({
      tournament_id: tId,
      question_et: qEt,
      question_en: qEn,
      max_points: parseInt(points, 10),
      deadline: new Date(deadline).toISOString(),
    });

    if (!error) {
      setShowNewForm(false);
      setQEt(''); setQEn(''); setPoints('5'); setDeadline('');
      fetchData();
    } else {
      alert('Viga küsimuse lisamisel: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="spinner mx-auto mt-10" style={{ width: 40, height: 40 }} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title mb-0">Eriküsimuste Haldus</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewForm(!showNewForm)}
        >
          {showNewForm ? 'Tühista' : '+ Loo uus küsimus'}
        </button>
      </div>

      {showNewForm && (
        <div className={styles.adminCard}>
          <h2 className="text-xl font-bold mb-4">Uus eriküsimus</h2>
          <form onSubmit={handleCreateQuestion} className="grid gap-4">
            <div className="grid grid-2">
              <div className="input-group">
                <label className="input-label">Küsimus (ET)</label>
                <input type="text" className="input" value={qEt} onChange={e=>setQEt(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Küsimus (EN)</label>
                <input type="text" className="input" value={qEn} onChange={e=>setQEn(e.target.value)} required />
              </div>
            </div>
            
            <div className="grid grid-3">
              <div className="input-group">
                <label className="input-label">Max punktid</label>
                <input type="number" className="input" value={points} onChange={e=>setPoints(e.target.value)} min="1" required />
              </div>
              <div className="input-group">
                <label className="input-label">Tähtaeg</label>
                <input type="datetime-local" className="input" value={deadline} onChange={e=>setDeadline(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Turniir</label>
                <select className="input" value={tId} onChange={e=>setTId(e.target.value)} required>
                  {tournaments.map(t => <option key={t.id} value={t.id}>{t.name_et}</option>)}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvestan...' : 'Salvesta küsimus'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {questions.map(q => (
          <div key={q.id} className={styles.adminCard} style={{ marginBottom: 0 }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-1">{q.question_et}</h3>
                <div className="text-sm text-muted">
                  Max {q.max_points}p • Tähtaeg: {new Date(q.deadline).toLocaleString('et-EE')}
                </div>
              </div>
              <div>
                {q.is_resolved ? (
                  <span className="badge badge-success">Lahendatud</span>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Vastuste hindamine vajab eraldi vaadet')}>
                    Hinda vastuseid
                  </button>
                )}
              </div>
            </div>
            
            {q.correct_answer && (
              <div className="mt-4 p-3 bg-surface-300 rounded-md text-sm border border-border">
                <strong>Õige vastus:</strong> {q.correct_answer}
              </div>
            )}
          </div>
        ))}
        
        {questions.length === 0 && (
          <div className="text-center text-muted py-8">
            Ühtegi eriküsimust pole veel loodud.
          </div>
        )}
      </div>
    </div>
  );
}
