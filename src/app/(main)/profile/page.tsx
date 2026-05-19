'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';
import type { Profile, Locale } from '@/lib/types';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [emailReminders, setEmailReminders] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setProfile(data as Profile);
          setDisplayName(data.display_name);
          if (data.preferred_language) {
            setPreferredLanguage(data.preferred_language as Locale);
          }
          if (data.email_reminders_enabled !== undefined) {
            setEmailReminders(data.email_reminders_enabled);
          }
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          preferred_language: preferredLanguage,
          email_reminders_enabled: emailReminders,
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Update local i18n context if changed
      if (preferredLanguage !== locale) {
        setLocale(preferredLanguage);
      }

      setMessage({ type: 'success', text: t('profile.saved') });
    } catch {
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !profile) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingAvatar(true);
    setMessage(null);

    try {
      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // 3. Update profile record
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // 4. Update local state
      setProfile({ ...profile, avatar_url: data.publicUrl });
      setMessage({ type: 'success', text: t('profile.saved') });
    } catch {
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className="page-title">{t('profile.title')}</h1>

      <div className={`glass-card ${styles.profileCard}`}>
        {message && (
          <div className={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
            {message.text}
          </div>
        )}

        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {displayName ? displayName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            
            {uploadingAvatar && (
              <div className={styles.avatarOverlay}>
                <span className="spinner" />
              </div>
            )}
          </div>
          
          <div className={styles.avatarActions}>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {t('profile.changeAvatar')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className={styles.profileForm}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">
              {t('profile.email')}
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="display-name">
              {t('profile.displayName')}
            </label>
            <input
              id="display-name"
              type="text"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="language">
              {t('profile.language')}
            </label>
            <select
              id="language"
              className="input"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Locale)}
            >
              <option value="et">Eesti keel 🇪🇪</option>
              <option value="en">English 🇬🇧</option>
            </select>
          </div>

          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input
              id="profile-reminders"
              type="checkbox"
              checked={emailReminders}
              onChange={(e) => setEmailReminders(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label className="input-label" htmlFor="profile-reminders" style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
              Soovin e-mailile meeldetuletust, kui mängu alguseni on 15 minutit ja mul on ennustus tegemata
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
