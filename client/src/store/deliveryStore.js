import { create } from "zustand";
import { deliveryService } from "@/services/deliveryService";
import { getSocket, joinRoom, leaveRoom } from "@/socket/socket";

export const useDeliveryStore = create((set, get) => ({
  deliveries: [],
  availableMissions: [],
  activeDelivery: null,
  trackingLocation: null,
  isLoading: false,
  error: null,
  isTracking: false,

  fetchMyDeliveries: async () => {
    set({ isLoading: true, error: null });
    try {
      const deliveries = await deliveryService.fetchMyDeliveries();
      set({ deliveries, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchAvailableMissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const availableMissions = await deliveryService.fetchAvailableMissions();
      set({ availableMissions, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  acceptMission: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const delivery = await deliveryService.acceptMission(orderId);
      set((state) => ({
        availableMissions: state.availableMissions.filter(m => m.id !== orderId),
        deliveries: [delivery, ...state.deliveries],
        isLoading: false,
      }));
      return delivery;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchDeliveryById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const activeDelivery = await deliveryService.fetchDeliveryById(id);
      set({ activeDelivery, isLoading: false });
      
      // If delivery is active, fetch initial location
      if (["PICKED_UP", "IN_TRANSIT"].includes(activeDelivery.status)) {
        get().fetchInitialLocation(id);
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchInitialLocation: async (id) => {
    try {
      const location = await deliveryService.fetchDeliveryLocation(id);
      set({ trackingLocation: location });
    } catch (err) {
      console.error("Failed to fetch initial location:", err);
    }
  },

  updateStatus: async (id, status, proofImageUrl) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await deliveryService.updateDeliveryStatus(id, status, proofImageUrl);
      set((state) => ({
        activeDelivery: state.activeDelivery?.id === id ? { ...state.activeDelivery, ...updated } : state.activeDelivery,
        deliveries: state.deliveries.map((d) => (d.id === id ? { ...d, ...updated } : d)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  verifyOtp: async (id, otp) => {
    set({ isLoading: true, error: null });
    try {
      await deliveryService.verifyOtp(id, otp);
      set({ isLoading: false });
      // Refresh delivery details after verification
      await get().fetchDeliveryById(id);
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // Real-time tracking actions
  startTracking: (deliveryId) => {
    const socket = getSocket();
    if (!socket) return;

    set({ isTracking: true });
    joinRoom(deliveryId);

    socket.on("delivery:location:update", (payload) => {
      if (payload.deliveryId === deliveryId) {
        set({
          trackingLocation: {
            lat: payload.lat,
            lng: payload.lng,
            lastUpdatedAt: payload.timestamp,
          },
        });
      }
    });

    socket.on("delivery:status:update", (payload) => {
      if (payload.deliveryId === deliveryId) {
        // Refresh delivery details when status changes
        get().fetchDeliveryById(deliveryId);
      }
    });
  },

  stopTracking: (deliveryId) => {
    const socket = getSocket();
    if (socket) {
      socket.off("delivery:location:update");
      socket.off("delivery:status:update");
    }
    leaveRoom(deliveryId);
    set({ isTracking: false, trackingLocation: null });
  },

  // Delivery Partner: Update location
  sendLocationUpdate: async (id, lat, lng) => {
    try {
      await deliveryService.updateLocation(id, lat, lng);
      // No need to set state here as the socket event will come back if subscribed
    } catch (err) {
      console.error("Failed to send location update:", err);
    }
  },

  clearError: () => set({ error: null }),
  resetActiveDelivery: () => set({ activeDelivery: null, trackingLocation: null, isTracking: false }),
}));
