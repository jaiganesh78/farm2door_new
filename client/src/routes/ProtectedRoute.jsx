import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoadingScreen from "../components/LoadingScreen";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const location = useLocation();

  if (!_hasHydrated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
