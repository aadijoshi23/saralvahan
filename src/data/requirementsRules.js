export const RENEWAL_STORAGE_KEY = 'saralvahan-renewal';
export const READINESS_STORAGE_KEY = 'saralvahan-requirements-readiness';

const requirementDefinitions = [
  { id: 'driving-licence', title: 'Existing Driving Licence', explanation: 'Keep your current driving licence available so its details can be checked.', required: true, reason: 'It identifies the licence you want to renew.', defaultReady: true },
  { id: 'identity-address-proof', title: 'Identity / Address Proof', explanation: 'A valid identity or address document may be used to confirm your details.', required: true, reason: 'This helps confirm your identity and current address.', defaultReady: true },
  { id: 'photograph', title: 'Photograph', explanation: 'A recent passport-style photograph may be requested for the renewed licence.', required: true, reason: 'A current photograph is needed for the licence record.', defaultReady: true },
  {
    id: 'medical-certificate', title: 'Medical Certificate / Form 1A',
    explanation: 'For this prototype, Form 1A is included for applicants aged 40 or above or for non-private licences.',
    requiredWhen: ({ age, licenceType }) => age >= 40 || licenceType !== 'private',
    reasonWhen: ({ age, licenceType }) => age >= 40
      ? 'You are 40 or older, so a medical fitness certificate may be requested.'
      : `A medical fitness certificate may be requested for a ${formatLicenceType(licenceType).toLowerCase()} licence.`,
    defaultReady: false,
  },
];

export const defaultRenewalAnswers = { age: 47, state: 'Uttarakhand', licenceType: 'private', expiryStatus: 'not-expired' };

export function normalizeRenewalAnswers(value) {
  if (!value || typeof value !== 'object') return defaultRenewalAnswers;
  const age = Number(value.age);
  return {
    age: Number.isFinite(age) && age > 0 ? age : defaultRenewalAnswers.age,
    state: typeof value.state === 'string' && value.state.trim() ? value.state.trim() : defaultRenewalAnswers.state,
    licenceType: typeof value.licenceType === 'string' && value.licenceType ? value.licenceType : defaultRenewalAnswers.licenceType,
    expiryStatus: typeof value.expiryStatus === 'string' && value.expiryStatus ? value.expiryStatus : defaultRenewalAnswers.expiryStatus,
  };
}

export function getRequirements(answers, readiness = {}) {
  return requirementDefinitions.map((item) => {
    const required = item.required ?? Boolean(item.requiredWhen?.(answers));
    if (!required) return null;
    return { id: item.id, title: item.title, explanation: item.explanation, required, reason: item.reason ?? item.reasonWhen(answers), readinessStatus: readiness[item.id] ?? (item.defaultReady ? 'ready' : 'missing') };
  }).filter(Boolean);
}

export function formatLicenceType(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : 'Not provided';
}

export function formatExpiryStatus(value) {
  const labels = { 'not-expired': 'Not expired', expired: 'Expired', 'expired-under-1-year': 'Expired less than 1 year', 'expired-over-1-year': 'Expired over 1 year' };
  return labels[value] ?? value?.replaceAll('-', ' ') ?? 'Not provided';
}
