'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import styles from './admin.module.css';

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    users: 0,
    matches: 0,
    predictions: 0,
    unconfirmedMatches: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Very basic stats counting
      const [
        { count: usersCount },
        { count: matchesCount },
        { count: predictionsCount },
        { count: unconfirmedCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('match_predictions').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('is_result_confirmed', false).eq('status', 'finished'),
      ]);

      setStats({
        users: usersCount || 0,
        matches: matchesCount || 0,
        predictions: predictionsCount || 0,
        unconfirmedMatches: unconfirmedCount || 0,
      });
    };

    fetchStats();
  }, [supabase]);

  return (
    <div>
      <h1 className="page-title mb-8">Admini Avaleht</h1>

      <div className="grid grid-4 mb-8">
        <div className={styles.adminCard}>
          <div className="text-muted text-sm uppercase">Kasutajaid</div>
          <div className="text-3xl font-bold text-accent">{stats.users}</div>
        </div>
        <div className={styles.adminCard}>
          <div className="text-muted text-sm uppercase">Mänge süsteemis</div>
          <div className="text-3xl font-bold text-accent">{stats.matches}</div>
        </div>
        <div className={styles.adminCard}>
          <div className="text-muted text-sm uppercase">Ennustusi kokku</div>
          <div className="text-3xl font-bold text-accent">{stats.predictions}</div>
        </div>
        <div className={styles.adminCard} style={{ borderColor: stats.unconfirmedMatches > 0 ? 'var(--color-warning)' : 'var(--color-border)' }}>
          <div className="text-muted text-sm uppercase">Kinnitamata mängud</div>
          <div className={`text-3xl font-bold ${stats.unconfirmedMatches > 0 ? 'text-warning' : 'text-success'}`}>
            {stats.unconfirmedMatches}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className={styles.adminCard}>
          <h2 className="text-xl font-bold mb-4">Kiired tegevused</h2>
          <div className="flex flex-col gap-3">
            <Link href="/admin/matches" className="btn btn-primary">
              Halda mänge ja kinnita tulemusi
            </Link>
            <Link href="/admin/questions" className="btn btn-secondary">
              Loo uus eriküsimus
            </Link>
          </div>
        </div>

        <div className={styles.adminCard}>
          <h2 className="text-xl font-bold mb-4">Info API kohta</h2>
          <p className="text-muted mb-4">
            Mängutulemusi tõmmatakse <strong>API-Football</strong> abil. API-Football
            võti peab olema lisatud Supabase Edge Functions keskkonnamuutujatesse.
          </p>
          <div className="badge badge-info mb-2 inline-block">
            Tasuta pakett lubab 100 päringut päevas.
          </div>
        </div>
      </div>
    </div>
  );
}
