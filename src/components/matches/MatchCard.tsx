import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import type { MatchWithPrediction } from '@/lib/types';
import styles from './MatchCard.module.css';

interface MatchCardProps {
  match: MatchWithPrediction;
  showPrediction?: boolean;
}

export default function MatchCard({ match, showPrediction = true }: MatchCardProps) {
  const { t, locale } = useI18n();

  // Format date and time
  const matchDate = new Date(match.match_datetime);
  const formattedDate = matchDate.toLocaleDateString(locale === 'et' ? 'et-EE' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const formattedTime = matchDate.toLocaleTimeString(locale === 'et' ? 'et-EE' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isMatchStarted = new Date() > matchDate;

  return (
    <Link href={`/matches/${match.id}`} className={styles.cardLink}>
      <div className={`glass-card ${styles.matchCard}`}>
        {/* Header: Status and Group/Stage */}
        <div className={styles.header}>
          <div className={styles.metaInfo}>
            <span className={styles.stageName}>
              {locale === 'et' ? match.stage.name_et : match.stage.name_en}
              {match.group && ` • ${t('groups.group')} ${match.group.name}`}
            </span>
            <span className={styles.dateTime}>
              {formattedDate} • {formattedTime}
            </span>
          </div>
          <div className={styles.status}>
            {match.status === 'live' && (
              <span className={`${styles.statusBadge} ${styles.liveBadge}`}>
                <span className="status-dot status-live" /> LIVE
              </span>
            )}
            {match.status === 'finished' && (
              <span className={`${styles.statusBadge} ${styles.finishedBadge}`}>
                {t('matches.matchFinished')}
              </span>
            )}
            {match.status === 'upcoming' && (
              <span className={`${styles.statusBadge} ${styles.upcomingBadge}`}>
                {t('matches.predict')}
              </span>
            )}
          </div>
        </div>

        {/* Teams and Score */}
        <div className={styles.teamsContainer}>
          <div className={styles.team}>
            <span className={`flag ${styles.flag}`}>{match.home_team.flag_emoji}</span>
            <span className={styles.teamName}>
              {locale === 'et' ? match.home_team.name_et : match.home_team.name_en}
            </span>
          </div>

          <div className={styles.scoreContainer}>
            {isMatchStarted ? (
              <div className={styles.actualScore}>
                {match.home_score ?? '-'} : {match.away_score ?? '-'}
              </div>
            ) : (
              <div className={styles.vsText}>{t('matches.vs')}</div>
            )}
          </div>

          <div className={`${styles.team} ${styles.teamRight}`}>
            <span className={styles.teamName}>
              {locale === 'et' ? match.away_team.name_et : match.away_team.name_en}
            </span>
            <span className={`flag ${styles.flag}`}>{match.away_team.flag_emoji}</span>
          </div>
        </div>

        {/* User Prediction */}
        {showPrediction && (
          <div className={styles.predictionSection}>
            <div className={styles.predictionDivider} />
            <div className={styles.predictionContent}>
              <span className={styles.predictionLabel}>{t('matches.yourPrediction')}:</span>
              {match.user_prediction ? (
                <div className={styles.predictionValue}>
                  {match.user_prediction.predicted_home_score} : {match.user_prediction.predicted_away_score}
                  
                  {match.status === 'finished' && match.user_prediction.points_earned !== null && (
                    <span className={`badge ${styles.pointsBadge} ${match.user_prediction.points_earned > 0 ? 'badge-success' : 'badge-error'}`}>
                      {match.user_prediction.points_earned} {t('common.points')}
                    </span>
                  )}
                </div>
              ) : (
                <span className={styles.noPrediction}>
                  {isMatchStarted ? t('matches.locked') : t('matches.noPrediction')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
