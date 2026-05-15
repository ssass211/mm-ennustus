'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { GroupWithTeams } from '@/lib/types';
import styles from './groups.module.css';

export default function GroupsPage() {
  const { t, locale } = useI18n();
  const supabase = createClient();

  const [groups, setGroups] = useState<GroupWithTeams[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      // Fetch groups and their teams
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          teams:group_teams(
            *,
            team:teams(*)
          )
        `)
        .order('sort_order', { ascending: true });

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Format data and calculate standings (mock for now, as real calculation requires matches data)
      // In a real app, you would join with matches and calculate points, or use a SQL view for standings
      const formattedGroups: GroupWithTeams[] = data.map((group) => {
        const teams = group.teams.map((gt: any) => ({
          ...gt,
          // Placeholder stats if not calculated in DB
          played: gt.played || 0,
          won: gt.won || 0,
          drawn: gt.drawn || 0,
          lost: gt.lost || 0,
          goals_for: gt.goals_for || 0,
          goals_against: gt.goals_against || 0,
          goal_difference: (gt.goals_for || 0) - (gt.goals_against || 0),
          points: (gt.won || 0) * 3 + (gt.drawn || 0) * 1,
        }));

        // Sort teams by points, then goal difference, then goals scored
        teams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
          return b.goals_for - a.goals_for;
        });

        return {
          ...group,
          teams,
        };
      });

      setGroups(formattedGroups);
      setLoading(false);
    };

    fetchGroups();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('groups.title')}</h1>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Alagruppide infot pole veel saadaval</div>
          <p>Alagrupid loositakse ja lisatakse hiljem.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {groups.map((group) => (
            <div key={group.id} className={`glass-card ${styles.groupCard}`}>
              <h2 className={styles.groupTitle}>{t('groups.group')} {group.name}</h2>
              
              <div className="table-container">
                <table className={styles.groupTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>{t('groups.team')}</th>
                      <th className="text-center hide-mobile" title={t('groups.played')}>{t('groups.played')}</th>
                      <th className="text-center hide-mobile" title={t('groups.won')}>{t('groups.won')}</th>
                      <th className="text-center hide-mobile" title={t('groups.drawn')}>{t('groups.drawn')}</th>
                      <th className="text-center hide-mobile" title={t('groups.lost')}>{t('groups.lost')}</th>
                      <th className="text-center" title={t('groups.goalDifference')}>{t('groups.goalDifference')}</th>
                      <th className="text-center" title={t('groups.points')}>{t('groups.points')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4" style={{ padding: '1rem' }}>
                          Meeskondi pole veel loositud
                        </td>
                      </tr>
                    ) : (
                      group.teams.map((groupTeam, index) => (
                        <tr 
                          key={groupTeam.id}
                          className={index < 2 ? styles.qualifiedTeam : (index === 2 ? styles.potentialTeam : '')}
                        >
                          <td className={styles.rankCell}>{index + 1}</td>
                          <td>
                            <div className={styles.teamCell}>
                              <span className="flag">{groupTeam.team.flag_emoji}</span>
                              <span className={styles.teamName}>
                                {locale === 'et' ? groupTeam.team.name_et : groupTeam.team.name_en}
                              </span>
                            </div>
                          </td>
                          <td className="text-center hide-mobile text-muted">{groupTeam.played}</td>
                          <td className="text-center hide-mobile text-muted">{groupTeam.won}</td>
                          <td className="text-center hide-mobile text-muted">{groupTeam.drawn}</td>
                          <td className="text-center hide-mobile text-muted">{groupTeam.lost}</td>
                          <td className="text-center">
                            {groupTeam.goal_difference > 0 ? `+${groupTeam.goal_difference}` : groupTeam.goal_difference}
                          </td>
                          <td className={`text-center ${styles.pointsCell}`}>
                            {groupTeam.points}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
