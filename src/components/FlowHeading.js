export default function FlowHeading({ eyebrow, title, description }) {
  return <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.14em] text-leaf-700">{eyebrow}</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1><p className="mt-3 text-base leading-7 text-stone-600 sm:text-lg">{description}</p></div>;
}
