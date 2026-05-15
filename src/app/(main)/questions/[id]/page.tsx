'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { SpecialQuestionWithAnswer, SpecialQuestionAnswer } from '@/lib/types';
import styles from './question.module.css';

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [question, setQuestion] = useState<SpecialQuestionWithAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [answer, setAnswer] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Other answers (only loaded if deadline has passed)
  const [otherAnswers, setOtherAnswers] = useState<(SpecialQuestionAnswer & { profile: { display_name: string, avatar_url: string | null } })[]>([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: qData, error } = await supabase
        .from('special_questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !qData) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Fetch user's answer
      const { data: answerData } = await supabase
        .from('special_question_answers')
        .select('*')
        .eq('question_id', id)
        .eq('user_id', user.id)
        .single();

      const questionWithAnswer: SpecialQuestionWithAnswer = {
        ...qData,
        user_answer: answerData || null,
      };

      setQuestion(questionWithAnswer);

      if (answerData) {
        setAnswer(answerData.answer);
      }

      // If deadline passed, fetch others' answers
      const isDeadlinePassed = new Date() > new Date(qData.deadline);
      if (isDeadlinePassed) {
        const { data: othersData } = await supabase
          .from('special_question_answers')
          .select(`
            *,
            profile:profiles(display_name, avatar_url)
          `)
          .eq('question_id', id)
          .neq('user_id', user.id);
          
        if (othersData) {
          setOtherAnswers(othersData as any);
        }
      }

      setLoading(false);
    };

    fetchQuestion();
  }, [id, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer.trim()) return;

    // Check if deadline passed
    if (new Date() > new Date(question.deadline)) {
      setMessage({ type: 'error', text: t('questions.deadlinePassed') });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const answerData = {
        user_id: user.id,
        question_id: question.id,
        answer: answer.trim(),
      };

      if (question.user_answer) {
        // Update
        const { error } = await supabase
          .from('special_question_answers')
          .update(answerData)
          .eq('id', question.user_answer.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('special_question_answers')
          .insert(answerData);
        if (error) throw error;
      }

      setMessage({ type: 'success', text: t('questions.answerSaved') });
      
      setQuestion({
        ...question,
        user_answer: {
          id: question.user_answer?.id || 'new',
          ...answerData,
          points_earned: null,
          is_reviewed: false,
          created_at: new Date().toISOString(),
        }
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Küsimust ei leitud</div>
        <Link href="/questions" className="btn btn-secondary mt-4">Tagasi nimekirja</Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(question.deadline);
  
  const deadlineDate = new Date(question.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString(locale === 'et' ? 'et-EE' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.container}>
      <Link href="/questions" className={styles.backLink}>
        ← {t('common.back')}
      </Link>

      <div className={`glass-card ${styles.questionDetailCard}`}>
        <div className={styles.questionHeader}>
          <div className={styles.pointsBadge}>
            Max {question.max_points} {t('common.points')}
          </div>
          <div className={styles.deadlineInfo}>
            {t('questions.deadline')}: {formattedDeadline}
          </div>
        </div>

        <h1 className={styles.questionTitle}>
          {locale === 'et' ? question.question_et : question.question_en}
        </h1>

        {question.is_resolved && question.correct_answer && (
          <div className={styles.correctAnswerBox}>
            <div className={styles.correctAnswerLabel}>{t('questions.correctAnswer')}:</div>
            <div className={styles.correctAnswerValue}>{question.correct_answer}</div>
          </div>
        )}

        <form onSubmit={handleSave} className={styles.answerForm}>
          {isDeadlinePassed && !question.is_resolved && (
            <div className={styles.lockedAlert}>
              🔒 {t('questions.deadlinePassed')} - vastuseid enam muuta ei saa.
            </div>
          )}

          {message && (
            <div className={message.type === 'success' ? 'badge badge-success mb-4 p-3 block' : 'badge badge-error mb-4 p-3 block'}>
              {message.text}
            </div>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="answer">
              {t('questions.yourAnswer')}
            </label>
            <textarea
              id="answer"
              className={`input ${styles.answerInput}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isDeadlinePassed || saving}
              placeholder="Kirjuta oma vastus siia..."
              required
              rows={4}
            />
          </div>

          {!isDeadlinePassed && (
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saving || !answer.trim()}
              >
                {saving ? <span className="spinner" style={{width: 16, height: 16}} /> : t('questions.submitAnswer')}
              </button>
            </div>
          )}
        </form>
        
        {/* Points earned */}
        {question.is_resolved && question.user_answer && question.user_answer.is_reviewed && (
          <div className={styles.pointsEarned}>
            <div className={styles.pointsLabel}>{t('questions.pointsEarned')}</div>
            <div className={`badge ${question.user_answer.points_earned && question.user_answer.points_earned > 0 ? 'badge-success' : 'badge-error'} ${styles.pointsValue}`}>
              {question.user_answer.points_earned || 0} {t('common.points')}
            </div>
          </div>
        )}
      </div>

      {/* Others' Answers (Only if deadline passed) */}
      {isDeadlinePassed && (
        <div className={styles.othersSection}>
          <h2 className="section-title">Teiste vastused</h2>
          
          <div className={`glass-card ${styles.othersCard}`}>
            {otherAnswers.length === 0 ? (
              <div className="text-center text-muted py-4">Ei ole teisi vastuseid</div>
            ) : (
              <div className={styles.othersList}>
                {otherAnswers.map((ans) => (
                  <div key={ans.id} className={styles.otherAnswerRow}>
                    <div className={styles.otherUser}>
                      {ans.profile.avatar_url ? (
                        <img src={ans.profile.avatar_url} alt="" className="avatar avatar-sm" />
                      ) : (
                        <div className="avatar avatar-sm">{ans.profile.display_name.charAt(0)}</div>
                      )}
                      <span>{ans.profile.display_name}</span>
                    </div>
                    
                    <div className={styles.otherAnswerText}>
                      "{ans.answer}"
                    </div>

                    <div className={styles.otherScore}>
                      {question.is_resolved && ans.is_reviewed && (
                        <span className={`badge ${(ans.points_earned || 0) > 0 ? 'badge-success' : 'badge-error'}`}>
                          {ans.points_earned || 0} {t('common.points')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
