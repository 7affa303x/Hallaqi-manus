import { mockBarbers } from './mockBarbers';

export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'reschedulable'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Appointment {
  id: string;
  barberId: string;
  barber: (typeof mockBarbers)[number];
  service: string;
  services: { name: string; price: number; duration: number }[];
  date: string;
  displayDate: string;
  time: string;
  displayTime: string;
  status: AppointmentStatus;
  price: number;
  location: string;
  isHomeService: boolean;
  rated?: boolean;
  rating?: number;
}

const barbers = mockBarbers;

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    barberId: barbers[0].id,
    barber: barbers[0],
    service: 'قص + لحية',
    services: [
      { name: 'قص الشعر', price: 500, duration: 30 },
      { name: 'تحديد اللحية', price: 300, duration: 20 },
    ],
    date: '2025-06-20',
    displayDate: 'الجمعة، 20 جوان',
    time: '10:30',
    displayTime: '10:30 صباحاً',
    status: 'confirmed',
    price: 800,
    location: 'حيدرة، الجزائر العاصمة',
    isHomeService: false,
  },
  {
    id: 'apt-2',
    barberId: barbers[2].id,
    barber: barbers[2],
    service: 'قص شعر + خدمة منزلية',
    services: [
      { name: 'قص الشعر', price: 600, duration: 35 },
      { name: 'خدمة منزلية', price: 500, duration: 0 },
    ],
    date: '2025-06-22',
    displayDate: 'الأحد، 22 جوان',
    time: '16:00',
    displayTime: '4:00 مساءً',
    status: 'pending',
    price: 1100,
    location: 'الأبيار، الجزائر العاصمة',
    isHomeService: true,
  },
  {
    id: 'apt-3',
    barberId: barbers[1].id,
    barber: barbers[1],
    service: 'قص الشعر',
    services: [{ name: 'قص الشعر', price: 400, duration: 25 }],
    date: '2025-06-25',
    displayDate: 'الأربعاء، 25 جوان',
    time: '11:00',
    displayTime: '11:00 صباحاً',
    status: 'reschedulable',
    price: 400,
    location: 'باب الزوار، الجزائر العاصمة',
    isHomeService: false,
  },
  {
    id: 'apt-4',
    barberId: barbers[0].id,
    barber: barbers[0],
    service: 'حمام تركي',
    services: [{ name: 'حمام تركي', price: 1200, duration: 60 }],
    date: '2025-05-15',
    displayDate: 'الخميس، 15 ماي',
    time: '14:00',
    displayTime: '2:00 مساءً',
    status: 'completed',
    price: 1200,
    location: 'حيدرة، الجزائر العاصمة',
    isHomeService: false,
    rated: true,
    rating: 5,
  },
  {
    id: 'apt-5',
    barberId: barbers[4].id,
    barber: barbers[4],
    service: 'قص + لحية',
    services: [
      { name: 'قص الشعر', price: 450, duration: 30 },
      { name: 'تحديد اللحية', price: 300, duration: 20 },
    ],
    date: '2025-05-28',
    displayDate: 'الأربعاء، 28 ماي',
    time: '09:30',
    displayTime: '9:30 صباحاً',
    status: 'completed',
    price: 750,
    location: 'المدنية، الجزائر العاصمة',
    isHomeService: false,
    rated: false,
  },
  {
    id: 'apt-6',
    barberId: barbers[5].id,
    barber: barbers[5],
    service: 'قص الشعر',
    services: [{ name: 'قص الشعر', price: 350, duration: 25 }],
    date: '2025-04-10',
    displayDate: 'الخميس، 10 أفريل',
    time: '15:00',
    displayTime: '3:00 مساءً',
    status: 'cancelled',
    price: 350,
    location: 'بوزريعة، الجزائر العاصمة',
    isHomeService: false,
  },
];

export const getUpcomingAppointments = () =>
  mockAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending' || a.status === 'reschedulable'
  );

export const getPastAppointments = () =>
  mockAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no-show'
  );

export const getAppointmentById = (id: string) =>
  mockAppointments.find((a) => a.id === id);
