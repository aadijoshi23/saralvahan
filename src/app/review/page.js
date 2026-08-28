'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowHeading from '@/components/FlowHeading';
import Header from '@/components/Header';
import MissingStep from '@/components/MissingStep';
import PrototypeNotice from '@/components/PrototypeNotice';
import ReviewSection from '@/components/ReviewSection';
import { APPLICATION_STORAGE_KEY, DEMO_APPLICATION_STORAGE_KEY, RENEWAL_STORAGE_KEY, emptyApplication, formatDate, validateApplication } from '@/data/applicationData';
import { useLanguage } from '@/i18n/LanguageProvider';

const applicantRows = [['Full name', 'fullName'], ['Date of birth', 'dateOfBirth'], ['Mobile number', 'mobileNumber'], ['Current address', 'currentAddress']];

function DetailList({ rows, values, t, language }) {
  return <dl className="grid gap-5 sm:grid-cols-2">{rows.map(([label, key]) => <div key={key}><dt className="text-sm font-medium text-stone-500">{t(label)}</dt><dd className="mt-1 break-words font-semibold leading-6 text-ink">{key.toLowerCase().includes('date') ? formatDate(values[key], language) : values[key] || t('Not provided')}</dd></div>)}</dl>;
}

export default function ReviewPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [application, setApplication] = useState(emptyApplication);
  const [renewal, setRenewal] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingStep, setMissingStep] = useState(null);

  useEffect(() => {
    try {
      const savedApplication = { ...emptyApplication, ...(JSON.parse(localStorage.getItem(APPLICATION_STORAGE_KEY)) || {}) };
      const savedRenewal = JSON.parse(localStorage.getItem(RENEWAL_STORAGE_KEY)) || {};
      if (!savedRenewal.age || !savedRenewal.state || !['private', 'commercial'].includes(savedRenewal.licenceType) || !savedRenewal.expiryStatus) {
        setMissingStep({ title: 'Complete the renewal questions first', description: 'Your renewal answers are needed before you can review an application.', href: '/renewal', action: 'Go to renewal questions' });
      } else if (Object.keys(validateApplication(savedApplication)).length) {
        setMissingStep({ title: 'Complete the application first', description: 'Add all required demo applicant and licence details before reviewing the application.', href: '/application', action: 'Go to application' });
      }
      setApplication(savedApplication);
      setRenewal(savedRenewal);
    } catch { setMissingStep({ title: 'Complete the application first', description: 'We could not find complete application details on this device.', href: '/application', action: 'Go to application' }); }
    setIsReady(true);
  }, []);

  function submitDemo() {
    if (Object.keys(validateApplication(application)).length) { router.push('/application'); return; }
    setIsSubmitting(true);
    const applicationId = `SV-2026-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    localStorage.setItem(DEMO_APPLICATION_STORAGE_KEY, JSON.stringify({ applicationId, status: 'submitted-demo', submittedAt: new Date().toISOString(), applicant: application, renewal }));
    router.push('/appointment');
  }

  if (!isReady) return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto max-w-3xl px-5 py-12" aria-label="Loading application review" /></div>;
  if (missingStep) return <MissingStep {...missingStep} />;
  const typeLabel = t(renewal.licenceType === 'commercial' ? 'Commercial' : renewal.licenceType === 'private' ? 'Private' : 'Not selected');
  const expiryLabels = { 'not-expired': 'Not expired', 'recently-expired': 'Expired recently', 'expired-over-year': 'Expired more than one year ago' };

  return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
    <FlowHeading eyebrow={t('Review application')} title={t('Check the demo application')} description={t('Review these synthetic details before simulating submission.')} />
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="alert"><strong>{t('No real submission will occur.')}</strong> {t('This button only creates a demo application record in your browser.')}</div>
    <div className="mt-7 space-y-4">
      <ReviewSection title="Renewal summary" editHref="/renewal"><DetailList t={t} language={language} values={{ state: renewal.state, age: renewal.age }} rows={[["Issuing state", 'state'], ['Applicant age', 'age']]} /></ReviewSection>
      <ReviewSection title="Applicant details" editHref="/application"><DetailList t={t} language={language} values={application} rows={applicantRows} /></ReviewSection>
      <ReviewSection title="Document readiness" editHref="/requirements"><ul className="space-y-3 text-sm leading-6 text-stone-700">{['Current driving licence details ready', 'Proof of age and address noted', 'Recent photograph requirement reviewed'].map((item) => <li key={item} className="flex gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-leaf-800" aria-hidden="true">✓</span>{t(item)}</li>)}</ul><p className="mt-4 text-sm text-stone-500">{t('Readiness is a prototype summary only; no files are uploaded or verified.')}</p></ReviewSection>
      <ReviewSection title="Licence details" editHref="/application"><DetailList t={t} language={language} values={{ licenceNumber: application.licenceNumber, licenceExpiryDate: application.licenceExpiryDate, licenceType: typeLabel, expiryStatus: t(expiryLabels[renewal.expiryStatus] || 'Not selected') }} rows={[["Driving licence number", 'licenceNumber'], ['Licence expiry date', 'licenceExpiryDate'], ['Licence type', 'licenceType'], ['Expiry status', 'expiryStatus']]} /></ReviewSection>
    </div>
    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link href="/application" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-6 py-3 font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">{t('Back to application')}</Link><button type="button" onClick={submitDemo} disabled={isSubmitting} className="min-h-14 rounded-xl bg-leaf-700 px-7 py-3 font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 disabled:bg-stone-400">{t(isSubmitting ? 'Submitting demo…' : 'Submit demo application')}</button></div>
  </main><PrototypeNotice /></div>;
}
