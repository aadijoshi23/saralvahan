'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PrototypeNotice from '@/components/PrototypeNotice';
import {
  APPOINTMENT_STORAGE_KEY,
  appointmentDates,
  appointmentSlots,
  getAppointmentDate,
  getDemoRto,
} from '@/data/appointmentData';
import { RENEWAL_STORAGE_KEY, normalizeRenewalAnswers } from '@/data/requirementsRules';

export default function AppointmentPage() {
  const router = useRouter();
  const [state, setState] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const renewal = normalizeRenewalAnswers(JSON.parse(localStorage.getItem(RENEWAL_STORAGE_KEY)));
      const saved = JSON.parse(localStorage.getItem(APPOINTMENT_STORAGE_KEY));
      setState(renewal.state);
      if (saved && appointmentSlots[saved.dateId]?.some((slot) => slot.time === saved.time && slot.available)) {
        setSelectedDate(saved.dateId);
        setSelectedTime(saved.time);
      }
    } catch {
      // Invalid prototype data is ignored so the citizen can choose again.
    } finally {
      setLoaded(true);
    }
  }, []);

  const rto = getDemoRto(state);
  const slots = appointmentSlots[selectedDate] ?? [];

  function chooseDate(dateId) {
    setSelectedDate(dateId);
    setSelectedTime('');
  }

  function confirmAppointment(event) {
    event.preventDefault();
    const date = getAppointmentDate(selectedDate);
    if (!date || !selectedTime) return;

    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify({
      state,
      rto,
      dateId: date.id,
      date: date.date,
      day: date.day,
      time: selectedTime,
    }));
    router.push('/success');
  }

  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main>
        <section className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
          <Link href="/review" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-leaf-800 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">
            <span aria-hidden="true">←</span> Back to review
          </Link>

          <div className="mt-5">
            <p className="text-sm font-bold uppercase tracking-wider text-leaf-700">RTO visit</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Choose an appointment</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Select a demo date and time for your in-person document check.</p>
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Selected state</p>
              <p className="mt-1 text-lg font-bold text-ink">{loaded ? state || 'Not provided' : 'Loading…'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Demo office</p>
              <p className="mt-1 text-lg font-bold text-ink">{loaded ? rto : 'Loading…'}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Appointment availability shown here is simulated for this prototype.</strong>
          </div>

          <form onSubmit={confirmAppointment} className="mt-8">
            <fieldset disabled={!loaded}>
              <legend className="text-xl font-bold text-ink">Select a date</legend>
              <p className="mt-1 text-sm text-stone-600">Unavailable dates cannot be selected.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {appointmentDates.map((item) => {
                  const available = item.availability === 'available';
                  const selected = selectedDate === item.id;
                  return (
                    <label key={item.id} className={`relative rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-leaf-100 has-[:focus-visible]:ring-offset-2 ${available ? 'cursor-pointer hover:border-leaf-600' : 'cursor-not-allowed bg-stone-100 text-stone-500'} ${selected ? 'border-leaf-700 bg-leaf-50' : 'border-stone-200 bg-white'}`}>
                      <input type="radio" name="appointmentDate" value={item.id} checked={selected} disabled={!available} onChange={() => chooseDate(item.id)} className="sr-only" />
                      <span className="block text-sm font-semibold">{item.day}</span>
                      <span className={`mt-1 block text-lg font-bold ${selected ? 'text-leaf-800' : ''}`}>{item.shortDate}</span>
                      <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${available ? 'bg-leaf-100 text-leaf-800' : 'bg-stone-200 text-stone-600'}`}>{available ? 'Available' : 'Unavailable'}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {selectedDate && (
              <fieldset className="mt-8">
                <legend className="text-xl font-bold text-ink">Select a time</legend>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {slots.map((slot) => {
                    const selected = selectedTime === slot.time;
                    return (
                      <label key={slot.time} className={`flex min-h-14 items-center justify-center rounded-xl border-2 px-3 py-3 text-center font-bold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-leaf-100 has-[:focus-visible]:ring-offset-2 ${slot.available ? 'cursor-pointer hover:border-leaf-600' : 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through'} ${selected ? 'border-leaf-700 bg-leaf-50 text-leaf-800' : slot.available ? 'border-stone-200 bg-white text-ink' : ''}`}>
                        <input type="radio" name="appointmentTime" value={slot.time} checked={selected} disabled={!slot.available} onChange={() => setSelectedTime(slot.time)} className="sr-only" />
                        {slot.time}<span className="sr-only">, {slot.available ? 'available' : 'unavailable'}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link href="/review" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-6 py-3 text-base font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 sm:min-w-36">Back</Link>
              <button type="submit" disabled={!selectedDate || !selectedTime} className="min-h-14 rounded-xl bg-leaf-700 px-7 py-3 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none sm:min-w-56">Confirm appointment</button>
            </div>
          </form>
        </section>
        <PrototypeNotice />
      </main>
      <footer className="px-5 py-8 text-center text-sm text-stone-500">SaralVahan · A citizen-first service prototype</footer>
    </div>
  );
}
