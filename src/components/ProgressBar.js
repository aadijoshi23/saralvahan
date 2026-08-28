'use client';
import { useLanguage } from '@/i18n/LanguageProvider';
export default function ProgressBar({ currentStep, totalSteps }) {
  const { t } = useLanguage();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-leaf-700">
          {t('Step {current} of {total}', { current: currentStep, total: totalSteps })}
        </p>
        <p className="text-sm font-medium text-stone-500">{t('Licence renewal')}</p>
      </div>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-leaf-100"
        role="progressbar"
        aria-label={t('Questionnaire progress')}
        aria-valuemin="1"
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      >
        <div className="h-full rounded-full bg-leaf-700 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
