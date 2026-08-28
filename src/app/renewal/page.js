'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import PrototypeNotice from '@/components/PrototypeNotice';
import { expiryOptions, licenceTypeOptions, states } from '@/data/renewalData';
import { useLanguage } from '@/i18n/LanguageProvider';

const STORAGE_KEY = 'saralvahan-renewal';
const STEP_KEY = 'saralvahan-renewal-step';
const initialAnswers = {
  age: '',
  state: '',
  licenceType: '',
  expiryStatus: '',
};

const isValidAge = (age) => Number.isInteger(Number(age)) && Number(age) >= 18 && Number(age) <= 120;

export default function RenewalPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedAnswers = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (savedAnswers && typeof savedAnswers === 'object') {
        setAnswers({ ...initialAnswers, ...savedAnswers });
      }

      const savedStep = Number(sessionStorage.getItem(STEP_KEY));
      if (Number.isInteger(savedStep) && savedStep >= 0 && savedStep < 4) {
        setStep(savedStep);
      }
    } catch {
      // Start fresh if saved prototype data cannot be read.
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      age: isValidAge(answers.age) ? Number(answers.age) : answers.age,
      state: answers.state,
      licenceType: answers.licenceType,
      expiryStatus: answers.expiryStatus,
    }));
    sessionStorage.setItem(STEP_KEY, String(step));
  }, [answers, isReady, step]);

  const currentAnswerIsValid = [
    isValidAge(answers.age),
    Boolean(answers.state),
    ['private', 'commercial'].includes(answers.licenceType),
    ['not-expired', 'recently-expired', 'expired-over-year'].includes(answers.expiryStatus),
  ][step];
  const answerHelp = [
    'Enter a whole-number age between 18 and 120 to continue.',
    'Select the state shown on your driving licence to continue.',
    'Choose a licence type to continue.',
    'Choose an expiry status to see your requirements.',
  ][step];

  function updateAnswer(field, value) {
    setAnswers((current) => ({ ...current, [field]: value }));
  }

  function continueQuestionnaire() {
    if (!currentAnswerIsValid) return;
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      age: Number(answers.age),
      state: answers.state,
      licenceType: answers.licenceType,
      expiryStatus: answers.expiryStatus,
    }));
    sessionStorage.removeItem(STEP_KEY);
    router.push('/requirements');
  }

  const questions = [
    <QuestionCard key="age" title={t('What is your age?')} description={t('Enter your age in completed years.')}>
      <label htmlFor="age" className="sr-only">{t('Age')}</label>
      <input
        id="age"
        type="number"
        inputMode="numeric"
        min="18"
        max="120"
        step="1"
        value={answers.age}
        onChange={(event) => updateAnswer('age', event.target.value)}
        placeholder={t('For example, 47')}
        className="min-h-16 w-full rounded-xl border-2 border-stone-200 bg-white px-5 text-lg text-ink outline-none transition placeholder:text-stone-400 focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"
        aria-describedby="age-help"
        aria-invalid={Boolean(answers.age) && !isValidAge(answers.age)}
        autoFocus
      />
      <p id="age-help" className="mt-3 text-sm leading-6 text-stone-500">{t('Enter a whole number between 18 and 120.')}</p>
    </QuestionCard>,
    <QuestionCard key="state" title={t('Which state issued your driving licence?')} description={t('Choose the state shown on your driving licence.')}>
      <label htmlFor="state" className="sr-only">{t('State that issued the driving licence')}</label>
      <select
        id="state"
        value={answers.state}
        onChange={(event) => updateAnswer('state', event.target.value)}
        className="min-h-16 w-full rounded-xl border-2 border-stone-200 bg-white px-5 text-lg text-ink outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"
        autoFocus
      >
        <option value="">{t('Select a state')}</option>
        {states.map((state) => <option key={state} value={state}>{state}</option>)}
      </select>
    </QuestionCard>,
    <QuestionCard key="licence-type" title={t('What type of driving licence do you have?')} description={t('Choose the option that best matches your licence.')}>
      <fieldset className="space-y-3">
        <legend className="sr-only">{t('Driving licence type')}</legend>
        {licenceTypeOptions.map((option) => (
          <label key={option.value} className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-lg font-semibold transition ${answers.licenceType === option.value ? 'border-leaf-700 bg-leaf-50 text-leaf-800' : 'border-stone-200 bg-white text-ink hover:border-leaf-100'}`}>
            <input type="radio" name="licenceType" value={option.value} checked={answers.licenceType === option.value} onChange={(event) => updateAnswer('licenceType', event.target.value)} className="h-5 w-5 accent-leaf-700" />
            {t(option.label)}
          </label>
        ))}
      </fieldset>
    </QuestionCard>,
    <QuestionCard key="expiry-status" title={t('What is your licence expiry status?')} description={t('Choose the option that applies today.')}>
      <fieldset className="space-y-3">
        <legend className="sr-only">{t('Licence expiry status')}</legend>
        {expiryOptions.map((option) => (
          <label key={option.value} className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-lg font-semibold transition ${answers.expiryStatus === option.value ? 'border-leaf-700 bg-leaf-50 text-leaf-800' : 'border-stone-200 bg-white text-ink hover:border-leaf-100'}`}>
            <input type="radio" name="expiryStatus" value={option.value} checked={answers.expiryStatus === option.value} onChange={(event) => updateAnswer('expiryStatus', event.target.value)} className="h-5 w-5 shrink-0 accent-leaf-700" />
            {t(option.label)}
          </label>
        ))}
      </fieldset>
    </QuestionCard>,
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <ProgressBar currentStep={step + 1} totalSteps={4} />
        <form onSubmit={(event) => { event.preventDefault(); continueQuestionnaire(); }} className="mt-7 sm:mt-9">
          {isReady ? questions[step] : <div className="min-h-72" aria-label={t('Loading your answers')} />}

          {!currentAnswerIsValid && isReady && <p id="continue-help" className="mt-5 text-sm font-medium leading-6 text-stone-600" role="status">{t(answerHelp)}</p>}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step === 0 ? <Link href="/" className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-6 py-3 text-base font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 sm:min-w-36">{t('Back')}</Link> : <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="min-h-14 rounded-xl border-2 border-stone-200 bg-white px-6 py-3 text-base font-bold text-ink transition hover:border-stone-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 sm:min-w-36"
            >{t('Back')}</button>}
            <button
              type="submit"
              disabled={!isReady || !currentAnswerIsValid}
              aria-describedby={!currentAnswerIsValid ? 'continue-help' : undefined}
              className="min-h-14 rounded-xl bg-leaf-700 px-7 py-3 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none sm:min-w-44"
            >
              {t(step === 3 ? 'See requirements' : 'Continue')}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm leading-6 text-stone-500">{t('Your answers are saved on this device so you can continue later.')}</p>
      </main><PrototypeNotice />
    </div>
  );
}
