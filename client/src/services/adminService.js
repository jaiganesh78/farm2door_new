import api from "@/api/axios";

export const adminService = {
  /**
   * Fetch all users (Admin only)
   */
  fetchUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data.data;
  },

  /**
   * Fetch all orders (Admin only)
   */
  fetchOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data.data;
  },

  /**
   * Fetch all deliveries (Admin only)
   */
  fetchDeliveries: async () => {
    const response = await api.get("/admin/deliveries");
    return response.data.data;
  },

  /**
   * Resolve a dispute (Admin only)
   */
  resolveDispute: async (disputeId, resolution, action) => {
    const response = await api.patch(`/disputes/${disputeId}/resolve`, {
      resolution,
      action,
    });
    return response.data.data;
  },

  /**
   * Platform Analytics (Calculated from orders/users)
   */
  getAnalytics: async () => {
    // Since there's no dedicated analytics endpoint, we'll fetch orders/users
    // and calculate stats in the store.
    const [users, orders, deliveries] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/orders"),
      api.get("/admin/deliveries"),
    ]);

    return {
      users: users.data.data,
      orders: orders.data.data,
      deliveries: deliveries.data.data,
    };
  },
};
