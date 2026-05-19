'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { GroupWithTeams } from '@/lib/types';
import { getFlagUrl } from '@/lib/flags';
import styles from './groups.module.css';

export default function GroupsPage() {
  const { t, locale } = useI18n();
  const supabase = createClient();

  const [groups, setGroups] = useState<GroupWithTeams[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('sort_order', { ascending: true });

      // Fetch standings with team details
      const { data: standingsData, error: standingsError } = await supabase
        .from('group_standings')
        .select(`
          *,
          team:teams(*)
        `);

      if (groupsError || standingsError || !groupsData || !standingsData) {
        console.error('Error fetching groups data:', groupsError || standingsError);
        setLoading(false);
        return;
      }

      // Format data and calculate standings
      const formattedGroups: GroupWithTeams[] = groupsData.map((group) => {
        // Find all standings for this group
        const teams = standingsData
          .filter((st) => st.group_id === group.id)
          .map((st: any) => ({
            ...st,
            id: `${group.id}-${st.team_id}`, // Generate a unique ID for the list key
          }));

        // Sort teams by FIFA Official Rules:
        // 1. Points
        // 2. Goal Difference
        // 3. Goals For
        // 4. Manual Tiebreaker (Admin override for Fair Play / H2H)
        teams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
          if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
          return (b.manual_tiebreaker || 0) - (a.manual_tiebreaker || 0);
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
  }, []);

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
                              {getFlagUrl(groupTeam.team.code) ? (
                                <img src={getFlagUrl(groupTeam.team.code)!} alt={groupTeam.team.code} className="flag" style={{ width: 24, height: 18, objectFit: 'cover', borderRadius: 3, display: 'inline-block' }} />
                              ) : (
                                <span className="flag">{groupTeam.team.flag_emoji}</span>
                              )}
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
