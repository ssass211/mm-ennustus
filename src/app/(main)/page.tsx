'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import { useLeague } from '@/lib/LeagueContext';
import LeagueManager from '@/components/leagues/LeagueManager';
import { getFlagUrl } from '@/lib/flags';
import styles from './dashboard.module.css';
import type { MatchWithTeams, LeaderboardEntry } from '@/lib/types';

export default function DashboardPage() {
  const { t } = useI18n();
  const supabase = createClient();

  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const { activeLeague, setActiveLeague, userLeagues } = useLeague();
  const [stats, setStats] = useState({
    totalPoints: 0,
    predictions: 0,
    exactScores: 0,
    rank: '-',
  });
  const [loading, setLoading] = useState(true);
  const [showLeagueManager, setShowLeagueManager] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.display_name || user.email?.split('@')[0] || '');

        if (activeLeague) {
          const { data: lbData } = await supabase.rpc('get_league_leaderboard', { p_league_id: activeLeague.id });
          if (lbData) {
            const sortedData = [...lbData].sort((a, b) => {
              if (b.total_points !== a.total_points) return b.total_points - a.total_points;
              return b.exact_scores - a.exact_scores;
            });
            const userEntryIndex = sortedData.findIndex((u: any) => u.user_id === user.id);
            const userEntry = sortedData[userEntryIndex];
            
            if (userEntry) {
              setStats({
                totalPoints: userEntry.total_points,
                predictions: userEntry.predictions_count,
                exactScores: userEntry.exact_scores,
                rank: (userEntryIndex + 1).toString(),
              });
            } else {
              setStats({ totalPoints: 0, predictions: 0, exactScores: 0, rank: '-' });
            }
          }
        }
      }

      // Fetch upcoming matches
      const { data: upcoming } = await supabase
        .from('matches')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .eq('status', 'scheduled')
        .order('match_datetime', { ascending: true })
        .limit(3);
        
      if (upcoming) setUpcomingMatches(upcoming);

      setLoading(false);
    };

    fetchDashboard();
  }, [supabase, activeLeague]);

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

      {userLeagues.length === 0 ? (
        <div className="mb-8">
          <LeagueManager />
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-2 flex-wrap items-center">
            <span className="text-sm font-semibold text-muted mr-2">Aktiivne liiga:</span>
            {userLeagues.map(lm => (
              <button 
                key={lm.league_id} 
                className={`badge ${activeLeague?.id === lm.league_id ? 'badge-primary' : 'badge-outline cursor-pointer hover:bg-surface-200'}`}
                onClick={() => setActiveLeague(lm.leagues as any)}
                style={{ padding: '8px 16px', fontSize: '1rem' }}
              >
                {lm.leagues.name}
              </button>
            ))}
            <button
              className="badge badge-outline cursor-pointer hover:bg-surface-200"
              onClick={() => setShowLeagueManager(!showLeagueManager)}
              style={{ padding: '8px 16px', fontSize: '1rem', borderStyle: 'dashed', borderColor: 'var(--text-muted)' }}
            >
              + Lisa liiga
            </button>
            {userLeagues.find(lm => lm.league_id === activeLeague?.id)?.role === 'admin' && (
              <Link
                href={`/leagues/${activeLeague!.id}/admin`}
                className="badge badge-outline cursor-pointer hover:bg-surface-200"
                style={{ padding: '8px 16px', fontSize: '1rem', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                ⚙️ Liiga seaded
              </Link>
            )}
          </div>

          {(showLeagueManager) && (
            <div className="mb-8">
              <LeagueManager />
            </div>
          )}

          <div className={styles.statsGrid}>
            <Link href="/leaderboard" className={`glass-card ${styles.statCard} hover:bg-surface-200 transition-colors`}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statValue}>{stats.totalPoints}</div>
              <div className={styles.statLabel}>{t('dashboard.totalPoints')}</div>
            </Link>
            <Link href="/matches" className={`glass-card ${styles.statCard} hover:bg-surface-200 transition-colors`}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statValue}>{stats.predictions}</div>
              <div className={styles.statLabel}>{t('dashboard.predictions')}</div>
            </Link>
            <Link href="/matches" className={`glass-card ${styles.statCard} hover:bg-surface-200 transition-colors`}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statValue}>{stats.exactScores}</div>
              <div className={styles.statLabel}>{t('dashboard.exactScores')}</div>
            </Link>
            <Link href="/leaderboard" className={`glass-card ${styles.statCard} hover:bg-surface-200 transition-colors`}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statValue}>{stats.rank}</div>
              <div className={styles.statLabel}>{t('dashboard.rank')}</div>
            </Link>
          </div>
        </>
      )}

      {/* Tournament Countdown or Upcoming Matches */}
      {countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0 ? (
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
      ) : (
        <div className="mb-10">
          <h2 className="section-title">📅 Järgmised mängud</h2>
          <div className="grid grid-3">
            {upcomingMatches.map(match => (
              <Link key={match.id} href={`/matches/${match.id}`} className="glass-card hover:bg-surface-200 transition-colors" style={{ padding: 'var(--space-4)' }}>
                <div className="text-sm text-muted text-center mb-4">
                  {new Date(match.match_datetime).toLocaleDateString('et-EE', { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(match.match_datetime).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex justify-between items-center px-4">
                  <div className="text-center flex-1">
                    {getFlagUrl(match.home_team.code) ? (
                      <img src={getFlagUrl(match.home_team.code)!} alt="" className="mx-auto" style={{ width: 40, height: 'auto', borderRadius: 4, marginBottom: 8 }} />
                    ) : (
                      <div className="text-2xl mb-2">{match.home_team.flag_emoji}</div>
                    )}
                    <div className="font-bold text-sm">{match.home_team.code}</div>
                  </div>
                  <div className="text-muted font-bold px-2">VS</div>
                  <div className="text-center flex-1">
                    {getFlagUrl(match.away_team.code) ? (
                      <img src={getFlagUrl(match.away_team.code)!} alt="" className="mx-auto" style={{ width: 40, height: 'auto', borderRadius: 4, marginBottom: 8 }} />
                    ) : (
                      <div className="text-2xl mb-2">{match.away_team.flag_emoji}</div>
                    )}
                    <div className="font-bold text-sm">{match.away_team.code}</div>
                  </div>
                </div>
              </Link>
            ))}
            {upcomingMatches.length === 0 && <div className="text-muted">Mänge ei leitud.</div>}
          </div>
        </div>
      )}

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
