'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowHeading from '@/components/FlowHeading';
import Header from '@/components/Header';
import JourneyProgress from '@/components/JourneyProgress';
import PrerequisiteState from '@/components/PrerequisiteState';
import ReviewSection from '@/components/ReviewSection';
import { APPLICATION_STORAGE_KEY, DEMO_APPLICATION_STORAGE_KEY, emptyApplication, formatDate, validateApplication } from '@/data/applicationData';
import { READINESS_STORAGE_KEY, hasCompleteRenewalAnswers, hasReadyRequirements, normalizeRenewalAnswers } from '@/data/requirementsRules';

const applicantRows = [['Full name', 'fullName'], ['Date of birth', 'dateOfBirth'], ['Mobile number', 'mobileNumber'], ['Current address', 'currentAddress']];

function DetailList({ rows, values }) {
  return <dl className="grid gap-5 sm:grid-cols-2">{rows.map(([label, key]) => <div key={key}><dt className="text-sm font-medium text-stone-500">{label}</dt><dd className="mt-1 break-words font-semibold leading-6 text-ink">{key.toLowerCase().includes('date') ? formatDate(values[key]) : values[key] || 'Not provided'}</dd></div>)}</dl>;
}

export default function ReviewPage() {
  const router = useRouter();
  const [application, setApplication] = useState(emptyApplication);
  const [renewal, setRenewal] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingPrerequisite, setMissingPrerequisite] = useState(null);

  useEffect(() => {
    try {
      const savedApplication = { ...emptyApplication, ...(JSON.parse(localStorage.getItem(APPLICATION_STORAGE_KEY)) || {}) };
      const savedRenewal = normalizeRenewalAnswers(JSON.parse(localStorage.getItem(RENEWAL_STORAGE_KEY)));
      const readiness = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY)) || {};
      if (!hasCompleteRenewalAnswers(savedRenewal)) setMissingPrerequisite({ title: 'Answer the renewal questions first', message: 'Complete your eligibility answers before reviewing an application.', href: '/renewal', action: 'Go to renewal questions' });
      else if (!hasReadyRequirements(savedRenewal, readiness)) setMissingPrerequisite({ title: 'Complete your requirements checklist first', message: 'Mark every required demo document as ready before reviewing an application.', href: '/requirements', action: 'Go to requirements' });
      else if (Object.keys(validateApplication(savedApplication)).length) setMissingPrerequisite({ title: 'Complete the application first', message: 'Add all required demo applicant and driving licence details before reviewing the application.', href: '/application', action: 'Go to application' });
      setApplication(savedApplication);
      setRenewal(savedRenewal);
    } catch { setMissingPrerequisite({ title: 'Complete the renewal questions first', message: 'Your saved prototype data could not be read. Return to the renewal questions to continue safely.', href: '/renewal', action: 'Go to renewal questions' }); }
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
  if (missingPrerequisite) return <PrerequisiteState {...missingPrerequisite} />;
  const typeLabel = renewal.licenceType === 'commercial' ? 'Commercial' : renewal.licenceType === 'private' ? 'Private' : 'Not selected';
  const expiryLabels = { 'not-expired': 'Not expired', 'recently-expired': 'Expired recently', 'expired-over-year': 'Expired more than one year ago' };

  return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
    <JourneyProgress current={4} />
    <FlowHeading eyebrow="Review application" title="Check the demo application" description="Review these synthetic details before simulating submission." />
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="alert"><strong>No real submission will occur.</strong> This button only creates a demo application record in your browser.</div>
    <div className="mt-7 space-y-4">
      <ReviewSection title="Renewal summary" editHref="/renewal"><DetailList values={{ state: renewal.state, age: renewal.age }} rows={[["Issuing state", 'state'], ['Applicant age', 'age']]} /></ReviewSection>
      <ReviewSection title="Applicant details" editHref="/application"><DetailList values={application} rows={applicantRows} /></ReviewSection>
      <ReviewSection title="Document readiness" editHref="/requirements"><ul className="space-y-3 text-sm leading-6 text-stone-700">{['Current driving licence details ready', 'Proof of age and address noted', 'Recent photograph requirement reviewed'].map((item) => <li key={item} className="flex gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-leaf-800" aria-hidden="true">✓</span>{item}</li>)}</ul><p className="mt-4 text-sm text-stone-500">Readiness is a prototype summary only; no files are uploaded or verified.</p></ReviewSection>
      <ReviewSection title="Licence details" editHref="/application"><DetailList values={{ licenceNumber: application.licenceNumber, licenceExpiryDate: application.licenceExpiryDate, licenceType: typeLabel, expiryStatus: expiryLabels[renewal.expiryStatus] || 'Not selected' }} rows={[["Driving licence number", 'licenceNumber'], ['Licence expiry date', 'licenceExpiryDate'], ['Licence type', 'licenceType'], ['Expiry status', 'expiryStatus']]} /></ReviewSection>
    </div>
    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link href="/application" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-6 py-3 font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">Back to application</Link><button type="button" onClick={submitDemo} disabled={isSubmitting} className="min-h-14 rounded-xl bg-leaf-700 px-7 py-3 font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 disabled:bg-stone-400">{isSubmitting ? 'Submitting demo…' : 'Submit demo application'}</button></div>
  </main></div>;
}
