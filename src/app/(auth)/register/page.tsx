'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            email_reminders_enabled: emailReminders,
          },
        },
      });

      if (error) {
        setError(t('auth.registerError'));
        return;
      }

      // Try to sign in immediately (if email confirmation is disabled)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        router.push('/');
        router.refresh();
      } else {
        setSuccess(t('auth.registerSuccess'));
      }
    } catch {
      setError(t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <h2 className={styles.authTitle}>{t('auth.register')}</h2>

      {error && <div className={styles.authError}>{error}</div>}
      {success && <div className={styles.authSuccess}>{success}</div>}

      <form className={styles.authForm} onSubmit={handleRegister}>
        <div className="input-group">
          <label className="input-label" htmlFor="register-name">
            {t('auth.displayName')}
          </label>
          <input
            id="register-name"
            type="text"
            className="input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jaan Tamm"
            required
            autoComplete="name"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="register-email">
            {t('auth.email')}
          </label>
          <input
            id="register-email"
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
          <label className="input-label" htmlFor="register-password">
            {t('auth.password')}
          </label>
          <input
            id="register-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="register-confirm-password">
            {t('auth.confirmPassword')}
          </label>
          <input
            id="register-confirm-password"
            type="password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
          <input
            id="register-reminders"
            type="checkbox"
            checked={emailReminders}
            onChange={(e) => setEmailReminders(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label className="input-label" htmlFor="register-reminders" style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
            Soovin e-mailile meeldetuletust, kui mängu alguseni on 15 minutit ja mul on ennustus tegemata
          </label>
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
            t('auth.register')
          )}
        </button>
      </form>

      <div className={styles.authFooter}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login">{t('auth.login')}</Link>
      </div>
    </div>
  );
}
