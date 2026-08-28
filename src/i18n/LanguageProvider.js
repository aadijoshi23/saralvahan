'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { hi, LANGUAGE_STORAGE_KEY } from './translations';

const LanguageContext = createContext(null);

function interpolate(text, values) {
  return Object.entries(values || {}).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), text);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'hi') setLanguageState('hi');
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'hi' ? 'hi' : 'en'; }, [language]);
  const setLanguage = useCallback((next) => {
    const safe = next === 'hi' ? 'hi' : 'en';
    setLanguageState(safe);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, safe);
  }, []);
  const t = useCallback((english, values) => interpolate(language === 'hi' ? (hi[english] || english) : english, values), [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
