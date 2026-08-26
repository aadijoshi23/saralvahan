const steps = ['Eligibility', 'Requirements', 'Application', 'Review', 'Appointment', 'Complete'];

export default function JourneyProgress({ current }) {
  return (
    <nav aria-label="Renewal journey progress" className="mb-7">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-leaf-700">Step {current} of {steps.length}</p>
      <p className="mt-1 text-sm font-medium text-stone-600">{steps[current - 1]}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-leaf-100" role="progressbar" aria-label="Renewal journey progress" aria-valuemin="1" aria-valuemax={steps.length} aria-valuenow={current}>
        <div className="h-full rounded-full bg-leaf-700" style={{ width: `${(current / steps.length) * 100}%` }} />
      </div>
    </nav>
  );
}
