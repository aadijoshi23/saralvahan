import Link from 'next/link';

export default function PrimaryButton({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-leaf-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-leaf-800/15 transition hover:bg-leaf-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-100 focus-visible:ring-offset-2 sm:w-auto sm:min-w-52"
    >
      {children}
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
