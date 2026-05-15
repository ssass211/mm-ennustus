'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import styles from './dashboard.module.css';
import type { MatchWithTeams, LeaderboardEntry } from '@/lib/types';

export default function DashboardPage() {
  const { t } = useI18n();
  const supabase = createClient();

  const [userName, setUserName] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithTeams[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    predictions: 0,
    exactScores: 0,
    rank: '-',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserName(
          user.user_metadata?.display_name || user.email?.split('@')[0] || ''
        );
      }

      // For now, set placeholder data until database is set up
      setLoading(false);
    };

    fetchDashboard();
  }, [supabase]);

  // Tournament countdown
  const tournamentStart = new Date('2026-06-11T00:00:00Z');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = tournamentStart.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className={styles.skeletonHeader}>
          <div className="skeleton" style={{ width: 300, height: 36 }} />
          <div className="skeleton" style={{ width: 200, height: 20, marginTop: 8 }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 32 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>
          {t('dashboard.welcome')}, {userName}! 👋
        </h1>
        <p className={styles.welcomeSubtitle}>
          FIFA World Cup 2026 • USA 🇺🇸 / Kanada 🇨🇦 / Mehhiko 🇲🇽
        </p>
      </div>

      {/* Tournament Countdown */}
      <div className={styles.countdownCard}>
        <div className={styles.countdownTitle}>⚽ Turniiri alguseni</div>
        <div className="countdown">
          <div className="countdown-item">
            <div className="countdown-value">{countdown.days}</div>
            <div className="countdown-unit">{t('time.days')}</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(countdown.hours).padStart(2, '0')}</div>
            <div className="countdown-unit">{t('time.hours')}</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</div>
            <div className="countdown-unit">{t('time.minutes')}</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</div>
            <div className="countdown-unit">{t('time.seconds')}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statValue}>{stats.totalPoints}</div>
          <div className={styles.statLabel}>{t('dashboard.totalPoints')}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{stats.predictions}</div>
          <div className={styles.statLabel}>{t('dashboard.predictions')}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statValue}>{stats.exactScores}</div>
          <div className={styles.statLabel}>{t('dashboard.exactScores')}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{stats.rank}</div>
          <div className={styles.statLabel}>{t('dashboard.rank')}</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinksSection}>
        <h2 className="section-title">🚀 Kiirlingid</h2>
        <div className={styles.quickLinksGrid}>
          <Link href="/matches" className={styles.quickLink}>
            <div className={styles.quickLinkIcon}>⚽</div>
            <div className={styles.quickLinkText}>
              <div className={styles.quickLinkTitle}>{t('nav.matches')}</div>
              <div className={styles.quickLinkDesc}>Ennusta mängutulemusi</div>
            </div>
            <span className={styles.quickLinkArrow}>→</span>
          </Link>
          <Link href="/questions" className={styles.quickLink}>
            <div className={styles.quickLinkIcon}>❓</div>
            <div className={styles.quickLinkText}>
              <div className={styles.quickLinkTitle}>{t('nav.questions')}</div>
              <div className={styles.quickLinkDesc}>Vasta eriküsimustele</div>
            </div>
            <span className={styles.quickLinkArrow}>→</span>
          </Link>
          <Link href="/leaderboard" className={styles.quickLink}>
            <div className={styles.quickLinkIcon}>🏆</div>
            <div className={styles.quickLinkText}>
              <div className={styles.quickLinkTitle}>{t('nav.leaderboard')}</div>
              <div className={styles.quickLinkDesc}>Vaata edetabelit</div>
            </div>
            <span className={styles.quickLinkArrow}>→</span>
          </Link>
          <Link href="/groups" className={styles.quickLink}>
            <div className={styles.quickLinkIcon}>📋</div>
            <div className={styles.quickLinkText}>
              <div className={styles.quickLinkTitle}>{t('nav.groups')}</div>
              <div className={styles.quickLinkDesc}>Alagrupitabelid</div>
            </div>
            <span className={styles.quickLinkArrow}>→</span>
          </Link>
        </div>
      </div>

      {/* Scoring Info */}
      <div className={styles.scoringSection}>
        <h2 className="section-title">📖 Punktisüsteem</h2>
        <div className={`glass-card ${styles.scoringCard}`}>
          <div className={styles.scoringRow}>
            <span className={styles.scoringBadge} data-tier="exact">🎯</span>
            <span className={styles.scoringDesc}>{t('scoring.exactScore')}</span>
            <span className={styles.scoringPoints}>{t('scoring.points5')}</span>
          </div>
          <div className={styles.scoringRow}>
            <span className={styles.scoringBadge} data-tier="diff">📐</span>
            <span className={styles.scoringDesc}>{t('scoring.correctDifference')}</span>
            <span className={styles.scoringPoints}>{t('scoring.points3')}</span>
          </div>
          <div className={styles.scoringRow}>
            <span className={styles.scoringBadge} data-tier="outcome">✅</span>
            <span className={styles.scoringDesc}>{t('scoring.correctOutcome')}</span>
            <span className={styles.scoringPoints}>{t('scoring.points1')}</span>
          </div>
          <div className={styles.scoringRow}>
            <span className={styles.scoringBadge} data-tier="miss">❌</span>
            <span className={styles.scoringDesc}>{t('scoring.wrong')}</span>
            <span className={styles.scoringPoints}>{t('scoring.points0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
