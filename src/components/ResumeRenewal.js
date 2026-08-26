'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { APPOINTMENT_STORAGE_KEY } from '@/data/appointmentData';
import { APPLICATION_STORAGE_KEY, DEMO_APPLICATION_STORAGE_KEY, emptyApplication, validateApplication } from '@/data/applicationData';
import { READINESS_STORAGE_KEY, RENEWAL_STORAGE_KEY, hasCompleteRenewalAnswers, hasReadyRequirements, normalizeRenewalAnswers } from '@/data/requirementsRules';

function readObject(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

export default function ResumeRenewal() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const appointment = readObject(APPOINTMENT_STORAGE_KEY);
    const submitted = readObject(DEMO_APPLICATION_STORAGE_KEY);
    const application = { ...emptyApplication, ...(readObject(APPLICATION_STORAGE_KEY) || {}) };
    const renewal = normalizeRenewalAnswers(readObject(RENEWAL_STORAGE_KEY));
    const readiness = readObject(READINESS_STORAGE_KEY) || {};
    const hasApplicationProgress = Object.values(application).some(Boolean);
    const hasRenewalProgress = Object.values(renewal).some(Boolean);

    if (appointment?.dateId && appointment?.time) setResume({ href: '/success', label: 'View appointment summary', detail: 'Your demo appointment is saved on this device.' });
    else if (submitted?.status === 'submitted-demo') setResume({ href: '/appointment', label: 'Resume renewal', detail: 'Continue by choosing a demo appointment.' });
    else if (!hasCompleteRenewalAnswers(renewal) && (hasRenewalProgress || hasApplicationProgress)) setResume({ href: '/renewal', label: 'Resume renewal', detail: 'Continue your saved eligibility answers.' });
    else if (hasCompleteRenewalAnswers(renewal) && !hasReadyRequirements(renewal, readiness)) setResume({ href: '/requirements', label: 'Resume renewal', detail: 'Continue with your personalised checklist.' });
    else if (!Object.keys(validateApplication(application)).length) setResume({ href: '/review', label: 'Resume renewal', detail: 'Review your saved demo application.' });
    else if (hasApplicationProgress) setResume({ href: '/application', label: 'Resume renewal', detail: 'Continue your saved demo application.' });
    else if (hasCompleteRenewalAnswers(renewal)) setResume({ href: '/application', label: 'Resume renewal', detail: 'Continue with your demo application.' });
  }, []);

  if (!resume) return null;
  return <aside className="mt-6 max-w-2xl rounded-2xl border border-leaf-100 bg-leaf-50 p-4 sm:p-5" aria-label="Saved renewal progress"><p className="break-words text-sm leading-6 text-leaf-800">{resume.detail}</p><Link href={resume.href} className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-leaf-700 px-5 py-3 text-center font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 sm:w-auto">{resume.label}</Link></aside>;
}
