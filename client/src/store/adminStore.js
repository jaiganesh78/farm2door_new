import { create } from "zustand";
import { adminService } from "@/services/adminService";

export const useAdminStore = create((set, get) => ({
  users: [],
  orders: [],
  deliveries: [],
  listings: [],
  isLoading: false,
  error: null,

  // Derived Statistics
  stats: {
    totalUsers: 0,
    activeDeliveries: 0,
    escrowTotal: 0,
    totalRevenue: 0,
    orderCount: 0,
    farmerCount: 0,
    buyerCount: 0,
    deliveryCount: 0,
    listingCount: 0,
  },

  fetchAdminData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { users, orders, deliveries } = await adminService.getAnalytics();
      // Fetch listings from public endpoint
      const listingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
      const listingsData = await listingsResponse.json();
      const listings = listingsData.data || [];
      
      const stats = {
        totalUsers: users.length,
        farmerCount: users.filter(u => u.role === "FARMER").length,
        buyerCount: users.filter(u => u.role === "BUYER").length,
        deliveryCount: users.filter(u => u.role === "DELIVERY").length,
        orderCount: orders.length,
        listingCount: listings.length,
        activeDeliveries: deliveries.filter(d => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(d.status)).length,
        escrowTotal: orders.reduce((sum, o) => {
          if (o.payment?.escrowStatus === "HELD") return sum + (o.totalAmount || 0);
          return sum;
        }, 0),
        totalRevenue: orders.reduce((sum, o) => {
          if (o.paymentStatus === "SUCCESS") return sum + (o.totalAmount || 0);
          return sum;
        }, 0),
      };

      set({ 
        users, 
        orders, 
        deliveries, 
        listings,
        stats, 
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  resolveDispute: async (disputeId, resolution, action) => {
    try {
      await adminService.resolveDispute(disputeId, resolution, action);
      // Refresh data
      await get().fetchAdminData();
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
