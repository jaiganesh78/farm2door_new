import { create } from "zustand";
import { listingService } from "../services/listingService";
import { useAuthStore } from "./authStore";

export const useListingStore = create((set, get) => ({
  listings: [],
  myListings: [],
  currentListing: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    minPrice: "",
    maxPrice: "",
    minQty: "",
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchListings();
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        minPrice: "",
        maxPrice: "",
        minQty: "",
      },
    });
    get().fetchListings();
  },

  fetchListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await listingService.getAllListings(params);
      set({ listings: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchMyListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      // Backend doesn't have a specific /my-listings route, so we fetch all and filter by farmerId
      const response = await listingService.getAllListings();
      const myListings = response.data.filter(l => l.farmerId === user.id);
      set({ myListings, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchListingById: async (id) => {
    set({ isLoading: true, error: null, currentListing: null });
    try {
      const response = await listingService.getListingById(id);
      set({ currentListing: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createListing: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingService.createListing(data);
      set((state) => ({
        myListings: [response.data, ...state.myListings],
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateListing: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingService.updateListing(id, data);
      set((state) => ({
        myListings: state.myListings.map((l) =>
          l.id === id ? { ...l, ...response.data } : l
        ),
        currentListing: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await listingService.deleteListing(id);
      set((state) => ({
        myListings: state.myListings.filter((l) => l.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  uploadListingImage: async (id, file) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingService.uploadImage(id, file);
      set((state) => ({
        myListings: state.myListings.map((l) =>
          l.id === id ? { ...l, imageUrl: response.data.imageUrl } : l
        ),
        currentListing: state.currentListing?.id === id 
          ? { ...state.currentListing, imageUrl: response.data.imageUrl }
          : state.currentListing,
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
