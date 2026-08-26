export const APPLICATION_STORAGE_KEY = 'saralvahan-application';
export const DEMO_APPLICATION_STORAGE_KEY = 'saralvahan-demo-application';
export const RENEWAL_STORAGE_KEY = 'saralvahan-renewal';

export const emptyApplication = { fullName: '', dateOfBirth: '', mobileNumber: '', licenceNumber: '', currentAddress: '', licenceExpiryDate: '' };

export const demoApplication = {
  fullName: 'Ananya Sharma', dateOfBirth: '1988-06-15', mobileNumber: '9876543210',
  licenceNumber: 'DL-0420110149646', currentAddress: '24, Green Park, New Delhi, Delhi 110016', licenceExpiryDate: '2026-11-30',
};

export const applicationFields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'For example, Ananya Sharma' },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date', autoComplete: 'bday' },
  { name: 'mobileNumber', label: 'Mobile number', type: 'tel', inputMode: 'numeric', autoComplete: 'tel', placeholder: '10-digit demo mobile number' },
  { name: 'licenceNumber', label: 'Driving licence number', type: 'text', autoComplete: 'off', placeholder: 'For example, DL-0420110149646' },
  { name: 'currentAddress', label: 'Current address', type: 'textarea', autoComplete: 'street-address', placeholder: 'Enter a synthetic address for this prototype' },
  { name: 'licenceExpiryDate', label: 'Licence expiry date', type: 'date', autoComplete: 'off' },
];

export function validateApplication(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Enter the applicant’s full name.';
  if (!values.dateOfBirth) errors.dateOfBirth = 'Choose the applicant’s date of birth.';
  else if (new Date(`${values.dateOfBirth}T00:00:00`) >= new Date()) errors.dateOfBirth = 'Date of birth must be in the past.';
  if (!values.mobileNumber.trim()) errors.mobileNumber = 'Enter a demo mobile number.';
  else if (!/^\d{10}$/.test(values.mobileNumber.replace(/\s/g, ''))) errors.mobileNumber = 'Enter a 10-digit mobile number using numbers only.';
  if (!values.licenceNumber.trim()) errors.licenceNumber = 'Enter the driving licence number.';
  if (!values.currentAddress.trim()) errors.currentAddress = 'Enter the applicant’s current address.';
  if (!values.licenceExpiryDate) errors.licenceExpiryDate = 'Choose the licence expiry date.';
  return errors;
}

export function formatDate(value) {
  if (!value) return 'Not provided';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}
