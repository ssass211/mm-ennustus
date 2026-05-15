'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!data || !data.is_admin) {
        // Not an admin, redirect to home
        router.push('/');
        return;
      }

      setUserProfile(data);
      setLoading(false);
    };

    checkAdmin();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <>
      <Header
        user={{
          display_name: userProfile?.display_name || 'Admin',
          avatar_url: userProfile?.avatar_url || null,
          is_admin: true,
        }}
        onLogout={handleLogout}
      />
      
      <div className={styles.adminContainer}>
        {/* Admin Sidebar */}
        <aside className={styles.adminSidebar}>
          <div className={styles.sidebarHeader}>
            <h3>⚙️ {t('admin.title')}</h3>
          </div>
          <nav className={styles.sidebarNav}>
            <Link href="/admin" className={styles.sidebarLink}>
              Avaleht
            </Link>
            <Link href="/admin/matches" className={styles.sidebarLink}>
              Mängude haldus
            </Link>
            <Link href="/admin/questions" className={styles.sidebarLink}>
              Eriküsimused
            </Link>
            <Link href="/admin/stages" className={styles.sidebarLink}>
              Turniiri faasid
            </Link>
          </nav>
        </aside>
        
        {/* Admin Content */}
        <main className={styles.adminContent}>
          {children}
        </main>
      </div>
    </>
  );
}
