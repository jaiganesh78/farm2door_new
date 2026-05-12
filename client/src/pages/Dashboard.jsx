import { useAuthStore } from "@/store/authStore";
import BuyerDashboard from "./buyer/BuyerDashboard";
import FarmerDashboard from "./farmer/FarmerDashboard";
import DeliveryDashboard from "./delivery/DeliveryDashboard";
import AdminDashboard from "./admin/AdminDashboard";

const DashboardSwitcher = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "BUYER":
      return <BuyerDashboard />;
    case "FARMER":
      return <FarmerDashboard />;
    case "DELIVERY":
      return <DeliveryDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    default:
      return <BuyerDashboard />;
  }
};

export default DashboardSwitcher;
