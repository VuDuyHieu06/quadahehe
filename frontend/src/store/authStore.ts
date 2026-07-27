import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

// Persist thủ công bằng localStorage để khỏi thêm persist middleware.
export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const raw = localStorage.getItem('stayhub_user');
    return raw ? (JSON.parse(raw) as User) : null;
  })(),
  token: localStorage.getItem('stayhub_token'),
  setAuth: (user, token) => {
    localStorage.setItem('stayhub_user', JSON.stringify(user));
    localStorage.setItem('stayhub_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('stayhub_user');
    localStorage.removeItem('stayhub_token');
    set({ user: null, token: null });
  },
  isAdmin: () => get().user?.role === 'ADMIN',
}));
