import api from "@/api/axios";

export const deliveryService = {
  /**
   * Fetch all deliveries relevant to the current user's role
   */
  fetchMyDeliveries: async () => {
    const response = await api.get("/delivery/my");
    return response.data.data;
  },

  /**
   * Fetch available delivery missions
   */
  fetchAvailableMissions: async () => {
    const response = await api.get("/delivery/available");
    return response.data.data;
  },

  /**
   * Accept a delivery mission
   */
  acceptMission: async (orderId) => {
    const response = await api.post(`/delivery/${orderId}/accept`);
    return response.data.data;
  },

  /**
   * Fetch a single delivery by ID
   */
  fetchDeliveryById: async (id) => {
    const response = await api.get(`/delivery/${id}`);
    return response.data.data;
  },

  /**
   * Update delivery status (Delivery Partner only)
   */
  updateDeliveryStatus: async (id, status, proofImageUrl) => {
    const response = await api.patch(`/delivery/${id}/status`, {
      status,
      proofImageUrl,
    });
    return response.data.data;
  },

  /**
   * Verify delivery OTP (Buyer only)
   */
  verifyOtp: async (id, otp) => {
    const response = await api.post(`/delivery/${id}/verify`, { otp });
    return response.data.data;
  },

  /**
   * Update current location (Delivery Partner only)
   */
  updateLocation: async (id, lat, lng) => {
    const response = await api.post(`/delivery/${id}/location`, { lat, lng });
    return response.data.data;
  },

  /**
   * Fetch the last known location of a delivery
   */
  fetchDeliveryLocation: async (id) => {
    const response = await api.get(`/delivery/${id}/location`);
    return response.data.data;
  },

  /**
   * Upload delivery proof image
   */
  uploadProofImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    const response = await api.post(`/delivery/${id}/proof-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};
