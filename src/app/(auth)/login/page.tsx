'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(t('auth.loginError'));
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <h2 className={styles.authTitle}>{t('auth.login')}</h2>

      {error && <div className={styles.authError}>{error}</div>}

      <form className={styles.authForm} onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label" htmlFor="login-email">
            {t('auth.email')}
          </label>
          <input
            id="login-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sinu@email.ee"
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="login-password">
            {t('auth.password')}
          </label>
          <input
            id="login-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? (
            <span className="spinner" style={{ width: 20, height: 20 }} />
          ) : (
            t('auth.login')
          )}
        </button>
      </form>

      <div className={styles.authFooter}>
        {t('auth.noAccount')}{' '}
        <Link href="/register">{t('auth.register')}</Link>
      </div>
    </div>
  );
}
