'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import etTranslations from './et.json';
import enTranslations from './en.json';

const translations: Record<Locale, Record<string, Record<string, string>>> = {
  et: etTranslations,
  en: enTranslations,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale = 'et',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Also save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm-ennustus-locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const [section, ...rest] = key.split('.');
      const translationKey = rest.join('.');

      const sectionTranslations = translations[locale]?.[section];
      if (!sectionTranslations) return key;

      return sectionTranslations[translationKey] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * Get a localized value from an object with et/en keys
 */
export function getLocalized(obj: { et: string; en: string }, locale: Locale): string {
  return obj[locale] || obj.et;
}
