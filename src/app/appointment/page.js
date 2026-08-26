'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { DEMO_APPLICATION_STORAGE_KEY } from '@/data/applicationData';

export default function AppointmentPlaceholder() {
  const [applicationId, setApplicationId] = useState('');
  useEffect(() => { try { setApplicationId(JSON.parse(localStorage.getItem(DEMO_APPLICATION_STORAGE_KEY))?.applicationId || ''); } catch { /* Show without an ID. */ } }, []);
  return <div className="min-h-screen bg-[#fbfcf8]"><Header /><main className="mx-auto max-w-2xl px-5 py-12 text-center sm:px-8 sm:py-20"><div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-soft sm:p-10"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-2xl text-leaf-800" aria-hidden="true">✓</span><p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-leaf-700">Demo application saved</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Appointment stage coming next</h1>{applicationId && <p className="mt-5 text-lg text-stone-700">Demo application ID: <strong className="whitespace-nowrap text-ink">{applicationId}</strong></p>}<p className="mt-4 leading-7 text-stone-600">No government application was submitted. This placeholder is ready for the appointment journey to be added later.</p><Link href="/" className="mt-7 inline-flex min-h-14 items-center justify-center rounded-xl bg-leaf-700 px-7 py-3 font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">Return home</Link></div></main></div>;
}
