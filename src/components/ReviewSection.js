'use client';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function ReviewSection({ title, editHref, children }) {
  const { t } = useLanguage();
  const id = `${title.toLowerCase().replace(/\s/g, '-')}-title`;
  return <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-7" aria-labelledby={id}><div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4"><h2 id={id} className="text-xl font-bold text-ink">{t(title)}</h2>{editHref && <a href={editHref} className="inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-sm font-bold text-leaf-700 underline decoration-2 underline-offset-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100">{t('Edit')}</a>}</div><div className="pt-5">{children}</div></section>;
}
