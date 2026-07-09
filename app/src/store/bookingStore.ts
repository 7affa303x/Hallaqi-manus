import { create } from 'zustand';

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  priceRange: [number, number];
  tags: string[];
  location: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  gallery?: string[];
  services?: Service[];
  about?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface BookingData {
  barber: Barber | null;
  service: Service | null;
  date: string | null;
  time: string | null;
  notes: string;
}

interface BookingState {
  booking: BookingData;
  favorites: string[];
  setBarber: (barber: Barber) => void;
  setService: (service: Service) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setNotes: (notes: string) => void;
  toggleFavorite: (barberId: string) => void;
  isFavorite: (barberId: string) => boolean;
  resetBooking: () => void;
}

const initialBooking: BookingData = {
  barber: null,
  service: null,
  date: null,
  time: null,
  notes: '',
};

export const useBookingStore = create<BookingState>((set, get) => ({
  booking: { ...initialBooking },
  favorites: [],
  setBarber: (barber) =>
    set((state) => ({ booking: { ...state.booking, barber } })),
  setService: (service) =>
    set((state) => ({ booking: { ...state.booking, service } })),
  setDate: (date) =>
    set((state) => ({ booking: { ...state.booking, date } })),
  setTime: (time) =>
    set((state) => ({ booking: { ...state.booking, time } })),
  setNotes: (notes) =>
    set((state) => ({ booking: { ...state.booking, notes } })),
  toggleFavorite: (barberId) =>
    set((state) => ({
      favorites: state.favorites.includes(barberId)
        ? state.favorites.filter((id) => id !== barberId)
        : [...state.favorites, barberId],
    })),
  isFavorite: (barberId) => get().favorites.includes(barberId),
  resetBooking: () => set({ booking: { ...initialBooking } }),
}));
