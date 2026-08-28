import Link from 'next/link';
import Header from '@/components/Header';
import PrototypeNotice from '@/components/PrototypeNotice';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function MissingStep({ title, description, href, action }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main>
        <section className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-soft sm:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-50 text-leaf-700" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none"><path d="M12 8v5m0 3v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /></svg>
            </span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-leaf-700">{t('One step first')}</p>
            <h1 className="mx-auto mt-2 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">{t(title)}</h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-600">{t(description)}</p>
            <Link href={href} className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-leaf-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 sm:w-auto sm:min-w-60">{t(action)}</Link>
          </div>
        </section>
        <PrototypeNotice />
      </main>
    </div>
  );
}
