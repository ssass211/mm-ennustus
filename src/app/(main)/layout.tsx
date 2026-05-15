'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { I18nProvider } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import type { Profile, Locale } from '@/lib/types';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialLocale, setInitialLocale] = useState<Locale>('et');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved locale
    const savedLocale = localStorage.getItem('mm-ennustus-locale') as Locale;
    if (savedLocale && (savedLocale === 'et' || savedLocale === 'en')) {
      setInitialLocale(savedLocale);
    }

    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        if (data.preferred_language) {
          setInitialLocale(data.preferred_language as Locale);
        }
      } else {
        // Profile not yet created, use basic info
        setProfile({
          id: user.id,
          display_name:
            user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
          avatar_url: null,
          preferred_language: 'et',
          is_admin: false,
          created_at: user.created_at,
        });
      }

      setLoading(false);
    };

    fetchProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <I18nProvider initialLocale={initialLocale}>
      <Header
        user={
          profile
            ? {
                display_name: profile.display_name,
                avatar_url: profile.avatar_url,
                is_admin: profile.is_admin,
              }
            : null
        }
        onLogout={handleLogout}
      />
      <main className="container page-content">{children}</main>
    </I18nProvider>
  );
}
