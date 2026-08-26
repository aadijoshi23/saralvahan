export const RENEWAL_STORAGE_KEY = 'saralvahan-renewal';
export const READINESS_STORAGE_KEY = 'saralvahan-requirements-readiness';

const validLicenceTypes = ['private', 'commercial'];
const validExpiryStatuses = ['not-expired', 'recently-expired', 'expired-over-year'];

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

export const defaultRenewalAnswers = { age: '', state: '', licenceType: '', expiryStatus: '' };

export function normalizeRenewalAnswers(value) {
  if (!value || typeof value !== 'object') return defaultRenewalAnswers;
  const age = Number(value.age);
  return {
    age: Number.isInteger(age) && age >= 18 && age <= 120 ? age : '',
    state: typeof value.state === 'string' ? value.state.trim() : '',
    licenceType: validLicenceTypes.includes(value.licenceType) ? value.licenceType : '',
    expiryStatus: validExpiryStatuses.includes(value.expiryStatus) ? value.expiryStatus : '',
  };
}

export function hasCompleteRenewalAnswers(answers) {
  return Boolean(answers.age && answers.state && answers.licenceType && answers.expiryStatus);
}

export function getRequirements(answers, readiness = {}) {
  return requirementDefinitions.map((item) => {
    const required = item.required ?? Boolean(item.requiredWhen?.(answers));
    const savedStatus = readiness[item.id];
    const readinessStatus = savedStatus === 'ready' || savedStatus === 'missing'
      ? savedStatus
      : item.defaultReady ? 'ready' : 'missing';

    return {
      id: item.id,
      title: item.title,
      explanation: required
        ? item.explanation
        : 'You do not need a medical certificate for this prototype based on the answers you provided.',
      required,
      reason: required
        ? item.reason ?? item.reasonWhen(answers)
        : 'This prototype only asks for Form 1A when the applicant is 40 or older or has a commercial licence.',
      readinessStatus: required ? readinessStatus : 'ready',
    };
  });
}

export function hasReadyRequirements(answers, readiness = {}) {
  return hasCompleteRenewalAnswers(answers)
    && getRequirements(answers, readiness).every((item) => !item.required || item.readinessStatus === 'ready');
}

export function formatLicenceType(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : 'Not provided';
}

export function formatExpiryStatus(value) {
  const labels = {
    'not-expired': 'Not expired',
    'recently-expired': 'Expired recently',
    'expired-over-year': 'Expired more than one year ago',
  };
  return labels[value] ?? value?.replaceAll('-', ' ') ?? 'Not provided';
}
