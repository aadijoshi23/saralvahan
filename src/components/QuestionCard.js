export default function QuestionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft sm:p-9" aria-labelledby="question-title">
      <h1 id="question-title" className="text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-stone-600 sm:text-lg">{description}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}
