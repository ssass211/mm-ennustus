'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import { getFlagUrl } from '@/lib/flags';
import type { Profile } from '@/lib/types';

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch predictions for closed matches only
      const now = new Date().toISOString();
      const { data: predsData } = await supabase
        .from('match_predictions')
        .select(`
          *,
          match:matches!inner(
            *,
            home_team:teams!home_team_id(*),
            away_team:teams!away_team_id(*)
          )
        `)
        .eq('user_id', id)
        .lt('match.match_datetime', now)
        .order('match(match_datetime)', { ascending: false });

      if (predsData) {
        // Sort in memory because PostgREST order by joined table sometimes has issues or syntax differs
        const sorted = predsData.sort((a, b) => {
          return new Date(b.match.match_datetime).getTime() - new Date(a.match.match_datetime).getTime();
        });
        setPredictions(sorted);
      }

      setLoading(false);
    };

    fetchUser();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Kasutajat ei leitud</div>
        <Link href="/leaderboard" className="btn btn-secondary mt-4">Tagasi edetabelisse</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/leaderboard" className="text-muted hover:text-white transition-colors mb-6 inline-block">
        ← {t('common.back')}
      </Link>

      <div className="glass-card mb-8 text-center" style={{ padding: '3rem 2rem' }}>
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="avatar avatar-lg mx-auto mb-4" />
        ) : (
          <div className="avatar avatar-lg mx-auto mb-4 text-2xl">{profile.display_name.charAt(0)}</div>
        )}
        <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
        <p className="text-muted">Kasutaja varasemad ennustused</p>
      </div>

      <h2 className="section-title">Ennustuste ajalugu</h2>
      
      {predictions.length === 0 ? (
        <div className="glass-card text-center text-muted py-8">
          Sellel kasutajal puuduvad suletud ennustused.
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((pred) => {
            const match = pred.match;
            const isMatchFinished = match.status === 'finished';
            
            return (
              <div key={pred.id} className="glass-card p-4 hover:bg-surface-200 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted">
                    {new Date(match.match_datetime).toLocaleDateString('et-EE', { day: 'numeric', month: 'long' })}
                  </div>
                  {isMatchFinished && pred.points_earned !== null ? (
                    <div className={`badge ${pred.points_earned > 0 ? 'badge-success' : 'badge-error'}`}>
                      {pred.points_earned} {t('common.points')}
                    </div>
                  ) : (
                    <div className="badge badge-outline">Ootab tulemust</div>
                  )}
                </div>

                <div className="flex justify-between items-center px-4">
                  <div className="text-center flex-1">
                    {getFlagUrl(match.home_team.code) ? (
                      <img src={getFlagUrl(match.home_team.code)!} alt="" className="mx-auto" style={{ width: 40, height: 'auto', borderRadius: 4, marginBottom: 8 }} />
                    ) : (
                      <div className="text-2xl mb-2">{match.home_team.flag_emoji}</div>
                    )}
                    <div className="font-bold">{match.home_team.code}</div>
                  </div>
                  
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold font-mono bg-surface-300 px-4 py-2 rounded-lg inline-block">
                      {pred.predicted_home_score} : {pred.predicted_away_score}
                    </div>
                    {isMatchFinished && (
                      <div className="text-sm text-muted mt-2">
                        Tegelik: {match.home_score} : {match.away_score}
                      </div>
                    )}
                  </div>

                  <div className="text-center flex-1">
                    {getFlagUrl(match.away_team.code) ? (
                      <img src={getFlagUrl(match.away_team.code)!} alt="" className="mx-auto" style={{ width: 40, height: 'auto', borderRadius: 4, marginBottom: 8 }} />
                    ) : (
                      <div className="text-2xl mb-2">{match.away_team.flag_emoji}</div>
                    )}
                    <div className="font-bold">{match.away_team.code}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
