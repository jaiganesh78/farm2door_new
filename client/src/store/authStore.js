import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api/axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: !!token });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const response = await api.get("/auth/me");
          set({ user: response.data, isAuthenticated: true });
        } catch (err) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Clear potential persistent storage
        localStorage.removeItem("auth-storage");
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  )
);
