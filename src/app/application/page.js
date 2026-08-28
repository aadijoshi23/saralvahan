'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowHeading from '@/components/FlowHeading';
import Header from '@/components/Header';
import ExplainThis from '@/components/ExplainThis';
import MissingStep from '@/components/MissingStep';
import PrototypeNotice from '@/components/PrototypeNotice';
import { APPLICATION_STORAGE_KEY, applicationFields, demoApplication, emptyApplication, validateApplication } from '@/data/applicationData';
import { READINESS_STORAGE_KEY, RENEWAL_STORAGE_KEY, getRequirements, hasCompleteRenewalAnswers, normalizeRenewalAnswers } from '@/data/requirementsRules';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function ApplicationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [values, setValues] = useState(emptyApplication);
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [hasPrerequisite, setHasPrerequisite] = useState(true);

  useEffect(() => {
    try {
      const renewal = normalizeRenewalAnswers(JSON.parse(localStorage.getItem(RENEWAL_STORAGE_KEY)));
      const readiness = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY)) || {};
      const requirementsReady = hasCompleteRenewalAnswers(renewal) && getRequirements(renewal, readiness).every((item) => !item.required || item.readinessStatus === 'ready');
      if (!requirementsReady) {
        setHasPrerequisite(false);
        setIsReady(true);
        return;
      }
      const saved = JSON.parse(localStorage.getItem(APPLICATION_STORAGE_KEY));
      if (saved && typeof saved === 'object') setValues({ ...emptyApplication, ...saved });
    } catch { /* Start with a fresh form if prototype data is unreadable. */ }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(values));
  }, [isReady, values]);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateApplication(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(values));
    router.push('/review');
  }

  if (isReady && !hasPrerequisite) return <MissingStep title="Finish your document checklist first" description="Review the personalised requirements and mark every required demo document as ready before starting the application." href="/requirements" action="Go to requirements" />;

  return <div className="min-h-screen bg-[#fbfcf8]">
    <Header />
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <FlowHeading eyebrow={t('Application details')} title={t('Tell us about the demo applicant')} description={t('Use synthetic information only. Do not enter Aadhaar, OTP, payment details, or real government credentials.')} />
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="note"><strong>{t('Prototype data only:')}</strong> {t('Everything entered here stays in this browser and is never sent to a government service.')}</div>
      <form onSubmit={submit} noValidate className="mt-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-8" aria-describedby="required-fields-note">
        <div className="flex flex-col items-stretch justify-between gap-3 border-b border-stone-100 pb-5 sm:flex-row sm:items-center"><p id="required-fields-note" className="text-sm leading-6 text-stone-600">{t('All fields are required.')}</p><button type="button" onClick={() => { setValues(demoApplication); setErrors({}); }} className="min-h-12 rounded-xl border-2 border-leaf-700 px-4 py-2 text-sm font-bold text-leaf-700 transition hover:bg-leaf-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">{t('Use demo applicant')}</button></div>
        <div className="mt-6 space-y-6" aria-busy={!isReady}>
          {applicationFields.map((field) => {
            const classes = `mt-2 min-h-14 w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-stone-400 focus:ring-4 ${errors[field.name] ? 'border-red-600 focus:border-red-600 focus:ring-red-100' : 'border-stone-200 focus:border-leaf-700 focus:ring-leaf-100'}`;
            const common = { id: field.name, value: values[field.name], onChange: (event) => updateField(field.name, event.target.value), className: classes, 'aria-invalid': Boolean(errors[field.name]), 'aria-describedby': errors[field.name] ? `${field.name}-error` : undefined };
            return <div key={field.name}><div className="flex flex-wrap items-center justify-between gap-1"><label htmlFor={field.name} className="font-bold text-ink">{t(field.label)} <span className="text-red-700" aria-hidden="true">*</span></label>{field.name === 'licenceNumber' && <ExplainThis term="Driving Licence Number" context="application form" />}</div>{field.type === 'textarea' ? <textarea {...common} autoComplete={field.autoComplete} placeholder={t(field.placeholder || '')} rows="3" /> : <input {...common} type={field.type} inputMode={field.inputMode} autoComplete={field.autoComplete} placeholder={t(field.placeholder || '')} />}{errors[field.name] && <p id={`${field.name}-error`} className="mt-2 text-sm font-semibold text-red-700" role="alert">{t(errors[field.name])}</p>}</div>;
          })}
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link href="/requirements" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-6 py-3 font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">{t('Back to requirements')}</Link><button type="submit" disabled={!isReady} className="min-h-14 rounded-xl bg-leaf-700 px-7 py-3 font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 disabled:bg-stone-300">{t('Continue to review')}</button></div>
      </form>
      <p className="mt-6 text-center text-sm leading-6 text-stone-500">{t('Progress is saved on this device so you can return after a refresh.')}</p>
    </main><PrototypeNotice />
  </div>;
}
