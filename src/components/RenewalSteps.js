'use client';
import { useLanguage } from '@/i18n/LanguageProvider';

const steps = [
  {
    number: '01',
    title: 'Check requirements',
    description: 'Answer a few simple questions to see what applies to you.',
  },
  {
    number: '02',
    title: 'Complete application',
    description: 'Get clear guidance while you prepare your renewal details.',
  },
  {
    number: '03',
    title: 'Know what happens next',
    description: 'Understand the next steps and what to expect after applying.',
  },
];

export default function RenewalSteps() {
  const { t } = useLanguage();
  return (
    <section aria-labelledby="how-it-works" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-leaf-700">{t('A simpler journey')}</p>
        <h2 id="how-it-works" className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('Three clear steps from start to finish')}
        </h2>
      </div>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft sm:p-7">
            <span className="text-sm font-bold text-saffron" aria-hidden="true">{step.number}</span>
            <h3 className="mt-7 text-xl font-bold text-ink">{t(step.title)}</h3>
            <p className="mt-3 leading-7 text-stone-600">{t(step.description)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
