'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';

const defaultDisclaimer = 'Guidance only. Verify official requirements on Parivahan.';
const hindiExplanations = {
  'Form 1A': { meaning: 'Form 1A एक मेडिकल फिटनेस प्रमाण पत्र है, जिसे कुछ ड्राइविंग लाइसेंस आवेदनों में डॉक्टर भरते और साइन करते हैं।', why: 'उम्र, लाइसेंस के प्रकार या आवेदन की स्थिति के कारण यह माँगा जा सकता है।', nextStep: 'अपनी चेकलिस्ट देखें, मौजूदा आधिकारिक फ़ॉर्म इस्तेमाल करें और शक होने पर RTO से पूछें।' },
  'Medical Certificate': { meaning: 'यह डॉक्टर द्वारा दिया गया वाहन चलाने की फिटनेस का प्रमाण पत्र है।', why: 'कुछ उम्र या लाइसेंस श्रेणियों में मेडिकल फिटनेस की जानकारी चाहिए हो सकती है।', nextStep: 'चेक करें कि कौन-सा फ़ॉर्म चाहिए और आधिकारिक निर्देश Parivahan या RTO से पक्के करें।' },
  'Driving Licence Number': { meaning: 'यह आपके ड्राइविंग लाइसेंस पर लिखा खास नंबर है, जिससे उसका सरकारी रिकॉर्ड पहचाना जाता है।', why: 'रिन्यूअल के लिए मौजूदा लाइसेंस रिकॉर्ड खोजने में यह नंबर काम आता है।', nextStep: 'नंबर ठीक वैसा ही लिखें जैसा लाइसेंस पर है। दिक्कत हो तो Parivahan या RTO से मदद लें।' },
  'Document Verification': { meaning: 'Document Verification — दस्तावेज़ जाँच में आपकी दी गई जानकारी और दस्तावेज़ मिलाए जाते हैं।', why: 'आवेदन आगे बढ़ाने से पहले दस्तावेज़ पूरे और सही हैं या नहीं, यह देखा जाता है।', nextStep: 'माँगे गए असली दस्तावेज़ तैयार रखें और किसी सुधार के निर्देश का जवाब दें।' },
  'Application Scrutiny': { meaning: 'Application Scrutiny — आवेदन जाँच में अधिकारी आवेदन और साथ दी गई जानकारी देखते हैं।', why: 'इससे तय होता है कि आवेदन पूरा है और अगले कदम पर जा सकता है।', nextStep: 'आवेदन की स्थिति देखते रहें और माँगी गई अतिरिक्त जानकारी समय पर दें।' },
};

export default function ExplainThis({ term, context, className = '' }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [explanation, setExplanation] = useState(null);
  const [explanationSource, setExplanationSource] = useState(null);
  const [apiFailure, setApiFailure] = useState(null);
  const [disclaimer, setDisclaimer] = useState(defaultDisclaimer);
  const [error, setError] = useState('');
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  async function loadExplanation() {
    setStatus('loading');
    setError('');
    setApiFailure(null);

    if (language === 'hi' && hindiExplanations[term]) {
      setExplanation(hindiExplanations[term]);
      setExplanationSource('local');
      setDisclaimer(t(defaultDisclaimer));
      setStatus('success');
      return;
    }

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term, context }),
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.error || 'We could not load this explanation right now.');
      setExplanation(data.explanation);
      setExplanationSource(data.source || 'openai');
      setApiFailure(data.apiFailure || null);
      setDisclaimer(data.disclaimer || defaultDisclaimer);
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'We could not load this explanation right now.');
      setStatus('error');
    }
  }

  function openDialog() {
    setIsOpen(true);
    if (!explanation && status !== 'loading') loadExplanation();
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
                <h2 id={titleId} className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{term}</h2>
              </div>
              <button ref={closeRef} type="button" onClick={closeDialog} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-stone-100 text-2xl leading-none text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100" aria-label={t('Close explanation')}>×</button>
            </div>

            <div id={descriptionId} className="mt-6" aria-live="polite">
              {status === 'loading' && (
                <div className="flex items-center gap-3 rounded-2xl bg-leaf-50 p-5 text-sm font-semibold text-leaf-800" role="status">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf-100 border-t-leaf-700" aria-hidden="true" />
                  {t('Preparing a simple explanation…')}
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5" role="alert">
                  <p className="font-bold text-red-800">{t('Explanation unavailable')}</p>
                  <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>
                  <button type="button" onClick={loadExplanation} className="mt-4 min-h-11 rounded-xl border-2 border-red-700 px-4 py-2 text-sm font-bold text-red-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100">{t('Try again')}</button>
                </div>
              )}

              {status === 'success' && explanation && (
                <div>
                  {explanationSource === 'openai' && (
                    <p className="mb-5 text-sm font-extrabold text-leaf-700">AI explanation</p>
                  )}
                  {explanationSource === 'fallback' && (
                    <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4" role="status">
                      <p className="text-sm font-extrabold text-amber-900">Prototype fallback guidance</p>
                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        {apiFailure?.message || 'The OpenAI explanation service was unavailable, so this local prototype explanation is shown instead.'}
                      </p>
                    </div>
                  )}
                  <dl className="space-y-5">
                    <ExplanationItem label={t('What it means')} value={explanation.meaning} />
                    <ExplanationItem label={t('Why you may be seeing it')} value={explanation.why} />
                    <ExplanationItem label={t('What to do next')} value={explanation.nextStep} />
                  </dl>
                </div>
              )}
            </div>

            <p className="mt-6 border-t border-stone-200 pt-4 text-xs leading-5 text-stone-500">{disclaimer}</p>
          </section>
        </div>
      )}
    </>
  );
}

function ExplanationItem({ label, value }) {
  return <div><dt className="text-sm font-bold text-ink">{label}</dt><dd className="mt-1 text-sm leading-6 text-stone-600">{value}</dd></div>;
}
