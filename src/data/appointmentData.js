export const APPOINTMENT_STORAGE_KEY = 'saralvahan-appointment';

export const appointmentDates = [
  {
    id: '2026-09-08',
    day: 'Tuesday',
    date: '8 September 2026',
    shortDate: '8 Sep',
    availability: 'available',
  },
  {
    id: '2026-09-10',
    day: 'Thursday',
    date: '10 September 2026',
    shortDate: '10 Sep',
    availability: 'unavailable',
  },
  {
    id: '2026-09-14',
    day: 'Monday',
    date: '14 September 2026',
    shortDate: '14 Sep',
    availability: 'available',
  },
];

export const appointmentSlots = {
  '2026-09-08': [
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: false },
    { time: '11:30 AM', available: true },
    { time: '2:00 PM', available: true },
  ],
  '2026-09-14': [
    { time: '9:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '12:30 PM', available: false },
    { time: '3:00 PM', available: true },
  ],
};

const demoRtos = {
  Uttarakhand: 'Dehradun RTO',
  Delhi: 'Sarai Kale Khan RTO, Delhi',
  Maharashtra: 'Pune RTO',
  Karnataka: 'Bengaluru Central RTO',
  'Uttar Pradesh': 'Lucknow RTO',
};

export function getDemoRto(state) {
  return demoRtos[state] ?? `${state || 'State'} Demo RTO`;
}

export function getAppointmentDate(dateId) {
  return appointmentDates.find((item) => item.id === dateId);
}

