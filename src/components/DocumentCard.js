import ExplainThis from '@/components/ExplainThis';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function DocumentCard({ requirement, onMarkReady }) {
  const { t } = useLanguage();
  const isReady = requirement.readinessStatus === 'ready';
  const statusLabel = requirement.required ? (isReady ? 'Ready' : 'Missing') : 'Not required';
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${isReady ? 'border-leaf-100' : 'border-amber-300'}`}>
      <div className="flex items-start gap-4">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${isReady ? 'bg-leaf-50 text-leaf-700' : 'bg-amber-50 text-amber-700'}`} aria-hidden="true">
          {isReady ? <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none"><path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none"><path d="M12 8v5m0 3v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /></svg>}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-ink">{t(requirement.title)}</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isReady ? 'bg-leaf-50 text-leaf-800' : 'bg-amber-100 text-amber-900'}`}>{t(statusLabel)}</span>
          </div>
          {requirement.explainTerms?.length > 0 && <div className="mt-1 flex flex-wrap gap-x-2">{requirement.explainTerms.map((term) => <ExplainThis key={term} term={term} context="document checklist" />)}</div>}
          <p className="mt-3 text-sm leading-6 text-stone-600">{t(requirement.explanation)}</p>
          <div className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700"><span className="font-semibold text-ink">{t('Why needed: ')}</span>{t(requirement.reason)}</div>
          {requirement.required && !isReady && <button type="button" onClick={() => onMarkReady(requirement.id)} className="mt-4 min-h-11 w-full rounded-xl border border-leaf-700 px-4 py-2.5 text-sm font-bold text-leaf-800 transition hover:bg-leaf-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 sm:w-auto">{t('Mark demo document ready')}</button>}
        </div>
      </div>
    </article>
  );
}
