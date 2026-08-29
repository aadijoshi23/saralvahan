'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { getExplanation } from '@/data/explanations';
import { useLanguage } from '@/i18n/LanguageProvider';

const disclaimer = 'Guidance for this prototype. Verify official requirements on Parivahan.';

export default function ExplainThis({ term, className = '' }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const explanation = getExplanation(term, language);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  function openDialog() {
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeDialog();
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!explanation) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className={`inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-leaf-700 underline decoration-leaf-100 decoration-2 underline-offset-4 transition hover:text-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 ${className}`}
        aria-label={`${t('Explain this')}: ${term}`}
      >
        {t('Explain this')} <span className="ml-1" aria-hidden="true">✨</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-leaf-700">{t('Simple explanation')}</p>
                <h2 id={titleId} className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{explanation.title}</h2>
              </div>
              <button ref={closeRef} type="button" onClick={closeDialog} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-stone-100 text-2xl leading-none text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100" aria-label={t('Close explanation')}>×</button>
            </div>

            <div id={descriptionId} className="mt-6">
              <dl className="space-y-5">
                <ExplanationItem label={t('What it means')} value={explanation.meaning} />
                <ExplanationItem label={t('Why you may be seeing it')} value={explanation.why} />
                <ExplanationItem label={t('What to do next')} value={explanation.nextStep} />
              </dl>
            </div>

            <p className="mt-6 border-t border-stone-200 pt-4 text-xs leading-5 text-stone-500">{t(disclaimer)}</p>
          </section>
        </div>
      )}
    </>
  );
}

function ExplanationItem({ label, value }) {
  return <div><dt className="text-sm font-bold text-ink">{label}</dt><dd className="mt-1 text-sm leading-6 text-stone-600">{value}</dd></div>;
}
