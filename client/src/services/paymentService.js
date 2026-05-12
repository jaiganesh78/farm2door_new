import api from "../api/axios";

export const paymentService = {
  createOrder: async (orderId) => {
    const response = await api.post(`/payments/${orderId}/create-order`);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post("/payments/verify", paymentData);
    return response.data;
  },
};
