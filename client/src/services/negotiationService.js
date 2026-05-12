import api from "../api/axios";

export const negotiationService = {
  createOffer: async (data) => {
    const response = await api.post("/negotiations/offer", data);
    return response.data;
  },

  getNegotiation: async (id) => {
    const response = await api.get(`/negotiations/${id}`);
    return response.data;
  },

  respond: async (id, data) => {
    const response = await api.post(`/negotiations/${id}/respond`, data);
    return response.data;
  },
};
