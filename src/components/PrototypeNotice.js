'use client';
import { useLanguage } from '@/i18n/LanguageProvider';
export default function PrototypeNotice() {
  const { t } = useLanguage();
  return (
    <aside className="border-y border-amber-200 bg-amber-50" aria-label="Prototype notice">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-5 py-5 sm:items-center sm:px-8 lg:px-10">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-amber-700 sm:mt-0" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 11v5m0-8v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-sm leading-6 text-amber-950 sm:text-base">
          <strong>{t('Prototype only:')}</strong> {t('This experience uses simulated government services and synthetic data. It does not submit a real application.')}
        </p>
      </div>
    </aside>
  );
}
