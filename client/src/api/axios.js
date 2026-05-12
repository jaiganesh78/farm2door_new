import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle Unauthorized (401)
    if (response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Normalize error message
    const message = response?.data?.message || response?.data?.error || "An unexpected error occurred";
    error.message = message;

    return Promise.reject(error);
  }
);

export default api;
