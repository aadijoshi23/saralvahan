import Header from '@/components/Header';
import PrimaryButton from '@/components/PrimaryButton';
import PrototypeNotice from '@/components/PrototypeNotice';
import RenewalSteps from '@/components/RenewalSteps';
import ResumeRenewal from '@/components/ResumeRenewal';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-leaf-50 lg:block" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-leaf-100 bg-white px-3 py-1.5 text-sm font-semibold text-leaf-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
                Driving licence renewal, made easier
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl">
                Renew your driving licence without the confusion.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
                We’ll guide you through the requirements, documents, application, and next steps—one clear step at a time.
              </p>
              <div className="mt-9">
                <PrimaryButton href="/renewal">Start Renewal</PrimaryButton>
              </div>
              <ResumeRenewal />
              <p className="mt-4 text-sm text-stone-500">Takes about 5 minutes to get started</p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:ml-auto" aria-hidden="true">
              <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-[#fbd7aa]" />
              <div className="relative rounded-3xl border border-leaf-100 bg-white p-5 shadow-soft sm:p-7">
                <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                  <div>
                    <div className="h-2.5 w-24 rounded-full bg-stone-200" />
                    <div className="mt-3 h-2 w-16 rounded-full bg-stone-100" />
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf-50 text-leaf-700">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                      <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="space-y-4 py-6">
                  {[80, 65, 72].map((width, index) => (
                    <div key={width} className="flex items-center gap-3">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${index === 0 ? 'bg-leaf-700 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        {index + 1}
                      </span>
                      <div className="h-2.5 rounded-full bg-stone-200" style={{ width: `${width}%` }} />
                    </div>
                  ))}
                </div>
                <div className="h-12 rounded-xl bg-leaf-700" />
              </div>
            </div>
          </div>
        </section>

        <RenewalSteps />
        <PrototypeNotice />
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-stone-500 sm:px-8 lg:px-10">
        SaralVahan · A citizen-first service prototype
      </footer>
    </div>
  );
}
