import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-stone-200/80 bg-white/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100"
          aria-label="SaralVahan home"
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-700 text-white shadow-sm"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path d="M4 15h16M7 15l1.4-5h7.2l1.4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 15v3m12-3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="16" cy="15" r="1" fill="currentColor" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-ink">
            Saral<span className="text-leaf-700">Vahan</span>
          </span>
        </Link>

        <span className="rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-leaf-800 sm:text-sm">
          Citizen services
        </span>
      </div>
    </header>
  );
}
