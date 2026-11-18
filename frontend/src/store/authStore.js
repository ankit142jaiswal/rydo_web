import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  
  login: (userData, token) => set({
    user: userData,
    isAuthenticated: true,
    token: token
  }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    token: null
  }),
  
  updateUser: (userData) => set((state) => ({
    user: { ...state.user, ...userData }
  }))
}));