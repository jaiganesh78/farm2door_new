import { create } from "zustand";
import { paymentService } from "../services/paymentService";
import api from "../api/axios";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  transactionStatus: "IDLE", // IDLE, PENDING, SUCCESS, FAILED

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/orders/my");
      set({ orders: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null, currentOrder: null });
    try {
      const response = await api.get(`/orders/${id}`);
      set({ currentOrder: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createPayment: async (orderId) => {
    set({ transactionStatus: "PENDING", error: null });
    try {
      const response = await paymentService.createOrder(orderId);
      return response.data; // { razorpayOrderId, amount, currency }
    } catch (err) {
      set({ transactionStatus: "FAILED", error: err.message });
      throw err;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await paymentService.verifyPayment(paymentData);
      set({ transactionStatus: "SUCCESS" });
      return response.data;
    } catch (err) {
      set({ transactionStatus: "FAILED", error: err.message });
      throw err;
    }
  },

  setTransactionStatus: (status) => set({ transactionStatus: status }),
}));
