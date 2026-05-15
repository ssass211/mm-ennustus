'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { MatchWithPrediction, MatchPrediction } from '@/lib/types';
import styles from './match.module.css';

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [match, setMatch] = useState<MatchWithPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Other predictions (only loaded if match has started)
  const [otherPredictions, setOtherPredictions] = useState<(MatchPrediction & { profile: { display_name: string, avatar_url: string | null } })[]>([]);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: matchData, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          group:groups(*),
          stage:stages(*)
        `)
        .eq('id', id)
        .single();

      if (error || !matchData) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Fetch user's prediction
      const { data: predictionData } = await supabase
        .from('match_predictions')
        .select('*')
        .eq('match_id', id)
        .eq('user_id', user.id)
        .single();

      const matchWithPrediction: MatchWithPrediction = {
        ...matchData,
        user_prediction: predictionData || null,
      };

      setMatch(matchWithPrediction);

      if (predictionData) {
        setHomeScore(predictionData.predicted_home_score.toString());
        setAwayScore(predictionData.predicted_away_score.toString());
      }

      // If match has started, fetch others' predictions
      const isMatchStarted = new Date() > new Date(matchData.match_datetime);
      if (isMatchStarted) {
        const { data: othersData } = await supabase
          .from('match_predictions')
          .select(`
            *,
            profile:profiles(display_name, avatar_url)
          `)
          .eq('match_id', id)
          .neq('user_id', user.id);
          
        if (othersData) {
          setOtherPredictions(othersData as any);
        }
      }

      setLoading(false);
    };

    fetchMatch();
  }, [id, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match || !homeScore || !awayScore) return;

    // Check if match already started
    if (new Date() > new Date(match.match_datetime)) {
      setMessage({ type: 'error', text: t('matches.predictionLocked') });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const predictionData = {
        user_id: user.id,
        match_id: match.id,
        predicted_home_score: parseInt(homeScore, 10),
        predicted_away_score: parseInt(awayScore, 10),
      };

      if (match.user_prediction) {
        // Update
        const { error } = await supabase
          .from('match_predictions')
          .update(predictionData)
          .eq('id', match.user_prediction.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('match_predictions')
          .insert(predictionData);
        if (error) throw error;
      }

      setMessage({ type: 'success', text: t('matches.predictionSaved') });
      
      // Update local state to show it was saved
      setMatch({
        ...match,
        user_prediction: {
          id: match.user_prediction?.id || 'new',
          ...predictionData,
          points_earned: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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

  if (!match) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Mängu ei leitud</div>
        <Link href="/matches" className="btn btn-secondary mt-4">Tagasi mängude nimekirja</Link>
      </div>
    );
  }

  const isMatchStarted = new Date() > new Date(match.match_datetime);
  
  const matchDate = new Date(match.match_datetime);
  const formattedDate = matchDate.toLocaleDateString(locale === 'et' ? 'et-EE' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const formattedTime = matchDate.toLocaleTimeString(locale === 'et' ? 'et-EE' : 'en-GB', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.container}>
      <Link href="/matches" className={styles.backLink}>
        ← {t('common.back')}
      </Link>

      <div className={`glass-card ${styles.matchDetailCard}`}>
        {/* Match Header info */}
        <div className={styles.matchMeta}>
          <div className={styles.matchStage}>
            {locale === 'et' ? match.stage.name_et : match.stage.name_en}
            {match.group && ` • ${t('groups.group')} ${match.group.name}`}
          </div>
          <div className={styles.matchTime}>
            {formattedDate} • {formattedTime}
          </div>
          {match.venue && <div className={styles.matchVenue}>📍 {match.venue}</div>}
        </div>

        {/* Score Board */}
        <div className={styles.scoreBoard}>
          <div className={styles.team}>
            <span className={`flag ${styles.flagLg}`}>{match.home_team.flag_emoji}</span>
            <span className={styles.teamName}>
              {locale === 'et' ? match.home_team.name_et : match.home_team.name_en}
            </span>
          </div>

          <div className={styles.actualScore}>
            {isMatchStarted ? (
              <>
                <span className={styles.scoreNumber}>{match.home_score ?? '-'}</span>
                <span className={styles.scoreDivider}>:</span>
                <span className={styles.scoreNumber}>{match.away_score ?? '-'}</span>
              </>
            ) : (
              <span className={styles.vsText}>{t('matches.vs')}</span>
            )}
          </div>

          <div className={styles.team}>
            <span className={`flag ${styles.flagLg}`}>{match.away_team.flag_emoji}</span>
            <span className={styles.teamName}>
              {locale === 'et' ? match.away_team.name_et : match.away_team.name_en}
            </span>
          </div>
        </div>
      </div>

      {/* Prediction Section */}
      <div className={styles.predictionSection}>
        <h2 className="section-title">{t('matches.yourPrediction')}</h2>
        
        <div className={`glass-card ${styles.predictionCard}`}>
          {isMatchStarted && (
            <div className={styles.lockedAlert}>
              🔒 {t('matches.predictionLocked')}
            </div>
          )}

          {message && (
            <div className={message.type === 'success' ? 'badge badge-success mb-4 p-3 block' : 'badge badge-error mb-4 p-3 block'}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className={styles.predictionForm}>
            <div className={styles.inputsWrapper}>
              <div className={styles.inputGroup}>
                <span className={`flag ${styles.flagSm}`}>{match.home_team.flag_emoji}</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="score-input"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  disabled={isMatchStarted || saving}
                  required
                />
              </div>
              
              <span className={styles.inputsDivider}>:</span>
              
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="score-input"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  disabled={isMatchStarted || saving}
                  required
                />
                <span className={`flag ${styles.flagSm}`}>{match.away_team.flag_emoji}</span>
              </div>
            </div>

            {!isMatchStarted && (
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saving || !homeScore || !awayScore}
              >
                {saving ? <span className="spinner" style={{width: 16, height: 16}} /> : t('matches.savePrediction')}
              </button>
            )}
          </form>
          
          {/* Points earned */}
          {match.status === 'finished' && match.user_prediction && match.user_prediction.points_earned !== null && (
            <div className={styles.pointsEarned}>
              <div className={styles.pointsLabel}>{t('questions.pointsEarned')}</div>
              <div className={`badge ${match.user_prediction.points_earned > 0 ? 'badge-success' : 'badge-error'} ${styles.pointsValue}`}>
                {match.user_prediction.points_earned} {t('common.points')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Others' Predictions (Only if match started) */}
      {isMatchStarted && (
        <div className={styles.othersSection}>
          <h2 className="section-title">{t('matches.otherPredictions')}</h2>
          
          <div className={`glass-card ${styles.othersCard}`}>
            {otherPredictions.length === 0 ? (
              <div className="text-center text-muted py-4">Ei ole teisi ennustusi</div>
            ) : (
              <div className={styles.othersList}>
                {otherPredictions.map((pred) => (
                  <div key={pred.id} className={styles.otherPrediction}>
                    <div className={styles.otherUser}>
                      {pred.profile.avatar_url ? (
                        <img src={pred.profile.avatar_url} alt="" className="avatar avatar-sm" />
                      ) : (
                        <div className="avatar avatar-sm">{pred.profile.display_name.charAt(0)}</div>
                      )}
                      <span>{pred.profile.display_name}</span>
                    </div>
                    
                    <div className={styles.otherScore}>
                      <span className={styles.otherScoreValue}>{pred.predicted_home_score} : {pred.predicted_away_score}</span>
                      
                      {match.status === 'finished' && pred.points_earned !== null && (
                        <span className={`badge ${pred.points_earned > 0 ? 'badge-success' : 'badge-error'}`}>
                          {pred.points_earned} {t('common.points')}
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
