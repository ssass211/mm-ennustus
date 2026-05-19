'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useLeague } from '@/lib/LeagueContext';
import styles from './Header.module.css';

interface HeaderProps {
  user: {
    display_name: string;
    avatar_url: string | null;
    is_admin: boolean;
  } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { activeLeague, setActiveLeague, userLeagues } = useLeague();

  const navItems = [
    { href: '/', label: t('nav.dashboard'), icon: '🏠' },
    { href: '/matches', label: t('nav.matches'), icon: '⚽' },
    { href: '/groups', label: t('nav.groups'), icon: '📋' },
    { href: '/questions', label: t('nav.questions'), icon: '❓' },
    { href: '/leaderboard', label: t('nav.leaderboard'), icon: '🏆' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚽</span>
            <span className={styles.logoText}>{t('common.appName')}</span>
          </Link>

          <nav className={`${styles.nav} hide-mobile`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  pathname === item.href ? styles.navLinkActive : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user?.is_admin && (
              <Link
                href="/admin"
                className={`${styles.navLink} ${styles.navLinkAdmin} ${
                  pathname.startsWith('/admin') ? styles.navLinkActive : ''
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          <div className={styles.headerRight}>
            <button
              className={styles.langToggle}
              onClick={() => setLocale(locale === 'et' ? 'en' : 'et')}
              title={locale === 'et' ? 'Switch to English' : 'Lülitu eesti keelde'}
            >
              {locale === 'et' ? '🇬🇧' : '🇪🇪'}
            </button>

            {userLeagues.length > 0 && (
              <select 
                className="input"
                value={activeLeague?.id || ''}
                onChange={(e) => {
                  const league = userLeagues.find(l => l.league_id === e.target.value)?.leagues;
                  if (league) setActiveLeague(league as any);
                }}
                style={{
                  padding: '6px 32px 6px 12px',
                  height: 'auto',
                  minHeight: '36px',
                  marginLeft: '12px',
                  fontSize: '0.9rem',
                  width: 'auto',
                  cursor: 'pointer'
                }}
              >
                {userLeagues.map((lm) => (
                  <option key={lm.league_id} value={lm.league_id} style={{ background: 'var(--surface-100)', color: 'var(--text-primary)', padding: '8px' }}>
                    {lm.leagues.name}
                  </option>
                ))}
              </select>
            )}

            {user && (
              <div className={styles.userMenu}>
                <Link href="/profile" className={styles.userAvatar}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name} />
                  ) : (
                    <span>{getInitials(user.display_name)}</span>
                  )}
                </Link>
                <button
                  className={`${styles.logoutBtn} hide-mobile`}
                  onClick={onLogout}
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className={`${styles.bottomNav} hide-desktop`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.bottomNavItem} ${
              pathname === item.href ? styles.bottomNavItemActive : ''
            }`}
          >
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
