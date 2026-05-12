import api from "../api/axios";

export const listingService = {
  getAllListings: async (params = {}) => {
    const response = await api.get("/listings", { params });
    return response.data;
  },

  getListingById: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  createListing: async (data) => {
    const response = await api.post("/listings", data);
    return response.data;
  },

  updateListing: async (id, data) => {
    const response = await api.patch(`/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post(`/listings/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
