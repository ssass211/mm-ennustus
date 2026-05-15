'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { MatchWithPrediction, Stage } from '@/lib/types';
import MatchCard from '@/components/matches/MatchCard';

export default function MatchesPage() {
  const { t, locale } = useI18n();
  const supabase = createClient();

  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch stages
      const { data: stagesData } = await supabase
        .from('stages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (stagesData) {
        setStages(stagesData);
        // Find first open stage or default to first
        const openStage = stagesData.find((s) => s.is_open);
        setActiveStageId(openStage ? openStage.id : stagesData[0]?.id);
      }

      // 2. Fetch matches with teams and predictions
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          group:groups(*),
          stage:stages(*),
          predictions:match_predictions(*)
        `)
        .order('match_datetime', { ascending: true });

      if (matchesData) {
        // Transform data to MatchWithPrediction format
        const formattedMatches: MatchWithPrediction[] = matchesData.map((match: any) => {
          // Find the user's prediction from the joined predictions array
          const userPrediction = match.predictions?.find(
            (p: any) => p.user_id === user.id
          );

          // Clean up the object
          delete match.predictions;

          return {
            ...match,
            user_prediction: userPrediction || null,
          };
        });

        setMatches(formattedMatches);
      }

      setLoading(false);
    };

    fetchMatches();
  }, [supabase]);

  // Filter matches by active stage
  const activeMatches = matches.filter((m) => m.stage_id === activeStageId);

  // Group matches by date
  const matchesByDate = activeMatches.reduce((acc, match) => {
    const dateStr = new Date(match.match_datetime).toLocaleDateString(
      locale === 'et' ? 'et-EE' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long' }
    );
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(match);
    return acc;
  }, {} as Record<string, MatchWithPrediction[]>);

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
        <h1 className="page-title">{t('matches.title')}</h1>
      </div>

      {/* Stage Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {stages.map((stage) => (
          <button
            key={stage.id}
            className={`tab ${activeStageId === stage.id ? 'active' : ''}`}
            onClick={() => setActiveStageId(stage.id)}
          >
            {locale === 'et' ? stage.name_et : stage.name_en}
            {!stage.is_open && ' 🔒'}
          </button>
        ))}
      </div>

      {/* Matches List */}
      {Object.keys(matchesByDate).length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">⚽</div>
          <div className="empty-state-title">Selles faasis mänge veel pole</div>
          <p>Mängud lisatakse varsti!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {Object.entries(matchesByDate).map(([dateStr, dayMatches]) => (
            <div key={dateStr}>
              <h2 className="section-title" style={{ fontSize: 'var(--font-size-lg)' }}>
                {/* Capitalize first letter */}
                {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
              </h2>
              <div className="grid grid-2">
                {dayMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
