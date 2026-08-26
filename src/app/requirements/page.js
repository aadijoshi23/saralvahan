'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import Header from '@/components/Header';
import JourneyProgress from '@/components/JourneyProgress';
import PrerequisiteState from '@/components/PrerequisiteState';
import PrototypeNotice from '@/components/PrototypeNotice';
import { READINESS_STORAGE_KEY, RENEWAL_STORAGE_KEY, defaultRenewalAnswers, formatExpiryStatus, formatLicenceType, getRequirements, hasCompleteRenewalAnswers, normalizeRenewalAnswers } from '@/data/requirementsRules';

export default function RequirementsPage() {
  const [answers, setAnswers] = useState(defaultRenewalAnswers);
  const [readiness, setReadiness] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [missingPrerequisite, setMissingPrerequisite] = useState(false);

  useEffect(() => {
    try {
      const savedAnswers = normalizeRenewalAnswers(JSON.parse(localStorage.getItem(RENEWAL_STORAGE_KEY)));
      if (!hasCompleteRenewalAnswers(savedAnswers)) {
        setMissingPrerequisite(true);
        return;
      }
      setAnswers(savedAnswers);
      const savedReadiness = JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY));
      if (savedReadiness && typeof savedReadiness === 'object') setReadiness(savedReadiness);
    } catch { setMissingPrerequisite(true); }
    finally { setLoaded(true); }
  }, []);

  const requirements = useMemo(() => getRequirements(answers, readiness), [answers, readiness]);
  const readyCount = requirements.filter((item) => item.readinessStatus === 'ready').length;
  const allReady = loaded && requirements.every((item) => !item.required || item.readinessStatus === 'ready');
  const markReady = (id) => setReadiness((current) => {
    const next = { ...current, [id]: 'ready' };
    localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(next));
    return next;
  });
  const summary = [['Age', `${answers.age} years`], ['State', answers.state], ['Licence', formatLicenceType(answers.licenceType)], ['Expiry', formatExpiryStatus(answers.expiryStatus)]];

  if (!loaded) return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto max-w-3xl px-5 py-12" aria-label="Loading requirements" /></div>;
  if (missingPrerequisite) return <PrerequisiteState title="Answer the renewal questions first" message="We need your age, issuing state, licence type, and expiry status before we can prepare the right checklist." href="/renewal" action="Go to renewal questions" />;

  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
          <JourneyProgress current={2} />
          <Link href="/renewal" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-leaf-800 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100"><span aria-hidden="true">←</span> Back to renewal</Link>
          <div className="mt-5">
            <p className="text-sm font-bold uppercase tracking-wider text-leaf-700">Personalised checklist</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Here&apos;s what you&apos;ll need</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Based on your renewal answers, we&apos;ve prepared a simple checklist for your application.</p>
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-4 sm:p-5">
            {summary.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl bg-stone-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-ink">{value}</dd></div>)}
          </dl>
          <div className="mt-8 rounded-2xl bg-leaf-800 p-5 text-white sm:p-6">
            <div className="flex items-end justify-between gap-4"><div><p className="text-sm text-leaf-100">Your progress</p><p className="mt-1 text-xl font-bold">{readyCount} of {requirements.length} requirements ready</p></div><span className="text-lg font-bold">{requirements.length ? Math.round((readyCount / requirements.length) * 100) : 0}%</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin="0" aria-valuemax={requirements.length} aria-valuenow={readyCount} aria-label={`${readyCount} of ${requirements.length} requirements ready`}><div className="h-full rounded-full bg-white transition-all" style={{ width: `${requirements.length ? (readyCount / requirements.length) * 100 : 0}%` }} /></div>
          </div>
          <div className="mt-6 space-y-4">{requirements.map((requirement) => <DocumentCard key={requirement.id} requirement={requirement} onMarkReady={markReady} />)}</div>
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><p className="font-bold">About conditional requirements</p><p className="mt-1">Some documents, such as a medical certificate, can depend on age, licence category, state rules, or other circumstances. This checklist uses simplified prototype rules; the official process may differ.</p></div>
          <div className="mt-8">
            {allReady ? <Link href="/application" className="inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-leaf-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2">Continue to application <span className="ml-2" aria-hidden="true">→</span></Link> : <button type="button" disabled className="min-h-14 w-full cursor-not-allowed rounded-xl bg-stone-200 px-6 py-4 text-base font-bold text-stone-500" aria-describedby="continue-help">Continue to application</button>}
            {!allReady && <p id="continue-help" className="mt-3 text-center text-sm text-stone-600">Mark every required item as ready to continue.</p>}
          </div>
        </section>
        <PrototypeNotice />
      </main>
      <footer className="px-5 py-8 text-center text-sm text-stone-500">SaralVahan · A citizen-first service prototype</footer>
    </div>
  );
}
