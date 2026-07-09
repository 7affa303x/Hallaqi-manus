import { create } from 'zustand';

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isVerified: boolean;
  subscriptionTier: 'free' | 'premium' | 'vip';
  notifications: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (user: UserData) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<UserData>) => void;
  clearNotifications: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  login: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  logout: () => set({ isAuthenticated: false, user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  clearNotifications: () =>
    set((state) => ({
      user: state.user ? { ...state.user, notifications: 0 } : null,
    })),
}));
