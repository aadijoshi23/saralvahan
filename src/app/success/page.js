'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import JourneyProgress from '@/components/JourneyProgress';
import PrerequisiteState from '@/components/PrerequisiteState';
import { APPOINTMENT_STORAGE_KEY } from '@/data/appointmentData';
import { DEMO_APPLICATION_STORAGE_KEY } from '@/data/applicationData';
import { READINESS_STORAGE_KEY, RENEWAL_STORAGE_KEY } from '@/data/requirementsRules';

const journeyKeys = [
  RENEWAL_STORAGE_KEY,
  READINESS_STORAGE_KEY,
  APPOINTMENT_STORAGE_KEY,
  DEMO_APPLICATION_STORAGE_KEY,
  'saralvahan-application',
  'saralvahan-application-data',
  'saralvahan-application-id',
  'saralvahan-review',
];

function readApplicationId() {
  const direct = localStorage.getItem('saralvahan-application-id');
  if (direct) return direct.replace(/^"|"$/g, '');

  for (const key of [DEMO_APPLICATION_STORAGE_KEY, 'saralvahan-application', 'saralvahan-application-data', 'saralvahan-review']) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      const id = value?.applicationId ?? value?.applicationID ?? value?.id;
      if (id) return String(id);
    } catch {
      // Try the next compatible prototype storage key.
    }
  }
  return '';
}

export default function SuccessPage() {
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setDetails(JSON.parse(localStorage.getItem(APPOINTMENT_STORAGE_KEY)));
      setApplicationId(readApplicationId());
    } catch {
      setDetails(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  function startAnotherRenewal() {
    journeyKeys.forEach((key) => localStorage.removeItem(key));
    sessionStorage.removeItem('saralvahan-renewal-step');
    localStorage.removeItem('saralvahan-renewal-step');
    router.push('/renewal');
  }

  if (!loaded) return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto max-w-3xl px-5 py-12" aria-label="Loading appointment summary" /></div>;
  if (!details?.dateId || !details?.time) return <PrerequisiteState title="Choose an appointment first" message="Your completion summary will be available after you select and confirm a demo appointment." href="/appointment" action="Choose an appointment" />;

  const carryItems = [
    'Your original driving licence',
    'Original identity and address proof',
    'A recent passport-size photograph',
    'Medical Certificate / Form 1A, if your checklist requires it',
    'This demo appointment summary for reference',
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <JourneyProgress current={6} />
        <section aria-labelledby="success-heading" className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-soft">
          <div className="bg-leaf-800 px-5 py-9 text-center text-white sm:px-8 sm:py-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-leaf-700" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none"><path d="m6.5 12.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-leaf-100">Prototype journey complete</p>
            <h1 id="success-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Application submitted successfully</h1>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-leaf-100">Your simulated renewal application and appointment details are ready below.</p>
          </div>

          <div className="p-5 sm:p-8">
            <dl className="grid gap-3 sm:grid-cols-2">
              {applicationId && <SummaryItem label="Demo application ID" value={applicationId} />}
              <SummaryItem label="Selected RTO" value={details?.rto || 'Not selected'} />
              <SummaryItem label="Appointment date" value={details?.date ? `${details.day}, ${details.date}` : 'Not selected'} />
              <SummaryItem label="Appointment time" value={details?.time || 'Not selected'} />
            </dl>

            <section aria-labelledby="carry-heading" className="mt-8">
              <h2 id="carry-heading" className="text-xl font-bold text-ink">What to carry</h2>
              <ul className="mt-4 space-y-3">
                {carryItems.map((item) => <li key={item} className="flex gap-3 leading-6 text-stone-700"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-800" aria-hidden="true">✓</span><span>{item}</span></li>)}
              </ul>
            </section>

            <section aria-labelledby="next-heading" className="mt-8 rounded-2xl bg-leaf-50 p-5 sm:p-6">
              <h2 id="next-heading" className="text-xl font-bold text-ink">What happens next</h2>
              <p className="mt-2 leading-7 text-stone-700">In a real renewal journey, you would follow the official acknowledgement and visit instructions, take the required originals to the RTO, and wait for the authority to verify and process your application. This prototype does not send or track anything.</p>
            </section>

            <aside className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-950" aria-label="Important prototype disclosure">
              <p className="font-extrabold">This is only a prototype.</p>
              <p className="mt-1 leading-7"><strong>No actual Parivahan application or government appointment has been created.</strong> The application ID, office, dates, times, and status shown here are synthetic.</p>
            </aside>

            <button type="button" onClick={startAnotherRenewal} className="mt-8 min-h-14 w-full rounded-xl bg-leaf-700 px-7 py-3 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2">Start another renewal</button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</dt><dd className="mt-1 break-words text-base font-bold text-ink">{value}</dd></div>;
}
