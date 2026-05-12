import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

let socket = null;

export const getSocket = () => {
  if (socket) return socket;

  const token = useAuthStore.getState().token;
  if (!token) return null;

  socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinRoom = (room) => {
  const s = getSocket();
  if (s) {
    s.emit("join", room);
  }
};

export const leaveRoom = (room) => {
  const s = getSocket();
  if (s) {
    s.emit("leave", room);
  }
};
