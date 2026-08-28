'use client';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <header className="border-b border-stone-200/80 bg-white/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 sm:gap-3"
          aria-label={t('SaralVahan home')}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf-700 text-white shadow-sm sm:h-10 sm:w-10"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path d="M4 15h16M7 15l1.4-5h7.2l1.4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 15v3m12-3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="16" cy="15" r="1" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-ink sm:text-xl">
            Saral<span className="text-leaf-700">Vahan</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <span className="hidden rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-leaf-800 sm:inline-flex">{t('Citizen services')}</span>
          <div className="flex shrink-0 items-center rounded-lg border border-stone-200 bg-white p-1 text-xs font-bold sm:text-sm" role="group" aria-label="Language / भाषा">
            <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`min-h-9 rounded-md px-2.5 ${language === 'en' ? 'bg-leaf-700 text-white' : 'text-stone-600 hover:bg-stone-50'}`}>English</button>
            <span className="px-0.5 text-stone-300" aria-hidden="true">|</span>
            <button type="button" onClick={() => setLanguage('hi')} aria-pressed={language === 'hi'} className={`min-h-9 rounded-md px-2.5 ${language === 'hi' ? 'bg-leaf-700 text-white' : 'text-stone-600 hover:bg-stone-50'}`}>हिंदी</button>
          </div>
        </div>
      </div>
    </header>
  );
}
