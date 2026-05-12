import { create } from "zustand";
import { negotiationService } from "../services/negotiationService";

export const useNegotiationStore = create((set, get) => ({
  activeNegotiation: null,
  negotiationsList: [],
  isLoading: false,
  error: null,

  createOffer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await negotiationService.createOffer(data);
      set({ isLoading: false });
      return response;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchNegotiation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await negotiationService.getNegotiation(id);
      set({ activeNegotiation: response, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  respondToOffer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await negotiationService.respond(id, data);
      set((state) => ({
        activeNegotiation: state.activeNegotiation?.id === id 
          ? { ...state.activeNegotiation, status: response.status } 
          : state.activeNegotiation,
        isLoading: false
      }));
      return response;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setList: (list) => set({ negotiationsList: list }),
}));
