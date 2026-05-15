'use client';

import { I18nProvider } from '@/lib/i18n';
import styles from './auth.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider initialLocale="et">
      <div className={styles.authPage}>
        <div className={styles.authBackground}>
          <div className={styles.bgOrb1} />
          <div className={styles.bgOrb2} />
          <div className={styles.bgOrb3} />
        </div>
        <div className={styles.authContainer}>
          <div className={styles.authLogo}>
            <span className={styles.authLogoIcon}>⚽</span>
            <h1 className={styles.authLogoText}>MM Ennustus &apos;26</h1>
            <p className={styles.authLogoSubtext}>FIFA World Cup 2026</p>
          </div>
          {children}
        </div>
      </div>
    </I18nProvider>
  );
}
