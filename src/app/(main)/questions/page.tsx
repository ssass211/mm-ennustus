'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import { useLeague } from '@/lib/LeagueContext';
import type { SpecialQuestionWithAnswer } from '@/lib/types';
import styles from './questions.module.css';

export default function QuestionsPage() {
  const { t, locale } = useI18n();
  const supabase = createClient();

  const [questions, setQuestions] = useState<SpecialQuestionWithAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeLeague } = useLeague();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!activeLeague) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('special_questions')
        .select(`
          *,
          answers:special_question_answers(*)
        `)
        .eq('league_id', activeLeague.id)
        .order('deadline', { ascending: true });

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      const formattedQuestions: SpecialQuestionWithAnswer[] = data.map((q: any) => {
        const userAnswer = q.answers?.find((a: any) => a.user_id === user.id);
        delete q.answers;
        return {
          ...q,
          user_answer: userAnswer || null,
        };
      });

      setQuestions(formattedQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, [supabase, activeLeague]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">{t('questions.title')}</h1>
        {activeLeague && <span className="badge badge-primary">{activeLeague.name}</span>}
      </div>

      {!activeLeague ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-title">Aktiivne liiga puudub</div>
          <p>Vali aktiivne liiga, et näha selle liiga eriküsimusi.</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-title">Eriküsimusi pole veel lisatud</div>
          <p>Admin lisab küsimusi peagi.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {questions.map((question) => {
            const isDeadlinePassed = new Date() > new Date(question.deadline);
            const deadlineDate = new Date(question.deadline);
            const formattedDeadline = deadlineDate.toLocaleDateString(
              locale === 'et' ? 'et-EE' : 'en-GB', 
              { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
            );

            return (
              <Link key={question.id} href={`/questions/${question.id}`} className={styles.questionCardLink}>
                <div className={`glass-card ${styles.questionCard}`}>
                  <div className={styles.questionHeader}>
                    <div className={styles.pointsBadge}>
                      Max {question.max_points} {t('common.points')}
                    </div>
                    {question.is_resolved ? (
                      <div className={`badge badge-success`}>{t('questions.resolved')}</div>
                    ) : isDeadlinePassed ? (
                      <div className={`badge badge-warning`}>{t('questions.deadlinePassed')}</div>
                    ) : (
                      <div className={`badge badge-info`}>
                        {t('questions.deadline')}: {formattedDeadline}
                      </div>
                    )}
                  </div>
                  
                  <h2 className={styles.questionTitle}>
                    {locale === 'et' ? question.question_et : question.question_en}
                  </h2>

                  <div className={styles.questionFooter}>
                    {question.user_answer ? (
                      <div className={styles.answerStatus}>
                        <span className={styles.statusIcon}>✅</span>
                        <span className={styles.statusText}>{t('questions.answered')}</span>
                        {question.user_answer.points_earned !== null && (
                          <span className={`badge ${question.user_answer.points_earned > 0 ? 'badge-success' : 'badge-error'} ml-auto`}>
                            +{question.user_answer.points_earned}p
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className={styles.answerStatus}>
                        <span className={styles.statusIconError}>❌</span>
                        <span className={styles.statusTextError}>{t('questions.notAnswered')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
