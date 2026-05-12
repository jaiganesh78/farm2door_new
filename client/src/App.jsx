import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Toaster from "./components/ui/Toaster";
import { useAuthStore } from "./store/authStore";
import "./App.css";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
