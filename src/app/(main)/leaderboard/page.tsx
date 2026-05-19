'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import { useLeague } from '@/lib/LeagueContext';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const { t } = useI18n();
  const supabase = createClient();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeLeague } = useLeague();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!activeLeague) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('get_league_leaderboard', { p_league_id: activeLeague.id });

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }
      
      // Sort by total_points DESC, exact_scores DESC
      const sortedData = [...data].sort((a, b) => {
        if (b.total_points !== a.total_points) return b.total_points - a.total_points;
        return b.exact_scores - a.exact_scores;
      });

      // Add rank considering ties
      let currentRank = 1;
      let prevPoints = -1;
      let prevExact = -1;

      const rankedData = sortedData.map((entry: any, index: number) => {
        if (entry.total_points !== prevPoints || entry.exact_scores !== prevExact) {
          currentRank = index + 1;
        }
        prevPoints = entry.total_points;
        prevExact = entry.exact_scores;

        return {
          ...entry,
          rank: currentRank,
        };
      });

      setLeaderboard(rankedData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [supabase, activeLeague]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">{t('leaderboard.title')}</h1>
        {activeLeague && <span className="badge badge-primary">{activeLeague.name}</span>}
      </div>

      {!activeLeague ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">🏆</div>
          <div className="empty-state-title">Aktiivne liiga puudub</div>
          <p>Edetabeli nägemiseks vali peamenüüst aktiivne liiga või liitu uue liigaga.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="text-center" style={{ width: '60px' }}>{t('leaderboard.rank')}</th>
                <th>{t('leaderboard.player')}</th>
                <th className="text-center hide-mobile" title="Täpsed skoorid">{t('leaderboard.exactScores')}</th>
                <th className="text-center hide-mobile">{t('leaderboard.predictions')}</th>
                <th className="text-center hide-mobile">{t('leaderboard.matchPoints')}</th>
                <th className="text-center hide-mobile">{t('leaderboard.questionPoints')}</th>
                <th className="text-center text-accent">{t('leaderboard.totalPoints')}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-8">
                    Edetabel on veel tühi.
                  </td>
                </tr>
              ) : (
                leaderboard.map((player) => (
                  <tr key={player.user_id} className="border-t border-border hover:bg-surface-200 transition-colors">
                    <td className="p-4 text-center">
                      <div className={`mx-auto rank ${
                        player.rank === 1 ? 'rank-1' :
                        player.rank === 2 ? 'rank-2' :
                        player.rank === 3 ? 'rank-3' : 'bg-surface-300'
                      }`}>
                        {player.rank}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <Link href={`/users/${player.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="avatar avatar-sm flex-shrink-0">
                          {player.avatar_url ? (
                            <img src={player.avatar_url} alt={player.display_name} />
                          ) : (
                            getInitials(player.display_name)
                          )}
                        </div>
                        <span className="font-semibold text-primary">{player.display_name}</span>
                      </Link>
                    </td>
                    
                    <td className="p-4 text-center hide-mobile text-muted">
                      {player.exact_scores}
                    </td>
                    
                    <td className="p-4 text-center hide-mobile text-muted">
                      {player.predictions_count}
                    </td>
                    
                    <td className="p-4 text-center hide-mobile">
                      {player.match_points}
                    </td>
                    
                    <td className="p-4 text-center hide-mobile">
                      {player.question_points}
                    </td>
                    
                    <td className="p-4 text-center">
                      <div className="points-large">{player.total_points}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}
