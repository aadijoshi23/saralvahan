import Link from 'next/link';
import Header from '@/components/Header';
import PrototypeNotice from '@/components/PrototypeNotice';

export default function PrerequisiteState({ title, message, href, action }) {
  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-14">
        <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-soft sm:p-8" aria-labelledby="prerequisite-heading">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-800" aria-hidden="true">!</span>
          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-leaf-700">Complete an earlier step</p>
          <h1 id="prerequisite-heading" className="mt-2 break-words text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl break-words text-base leading-7 text-stone-600 sm:text-lg">{message}</p>
          <Link href={href} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-leaf-700 px-6 py-3 text-center font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 sm:w-auto sm:min-w-56">{action}</Link>
        </section>
      </main>
      <PrototypeNotice />
    </div>
  );
}
