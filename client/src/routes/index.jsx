import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Unauthorized from "../pages/Unauthorized";

import Marketplace from "../pages/buyer/Marketplace";
import ListingDetails from "../pages/buyer/ListingDetails";
import FarmerListings from "../pages/farmer/FarmerListings";
import CreateListing from "../pages/farmer/CreateListing";
import EditListing from "../pages/farmer/EditListing";
import NegotiationsList from "../pages/shared/NegotiationsList";
import NegotiationChat from "../pages/shared/NegotiationChat";
import OrderSummary from "../pages/buyer/OrderSummary";
import OrdersList from "../pages/shared/OrdersList";
import OrderDetail from "../pages/shared/OrderDetail";
import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";
import DeliveryAvailable from "../pages/delivery/DeliveryAvailable";
import DeliveryTasks from "../pages/delivery/DeliveryTasks";
import DeliveryDetails from "../pages/delivery/DeliveryDetails";
import DeliveryTracking from "../pages/shared/DeliveryTracking";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Marketplace */}
        <Route path="/listings" element={<Marketplace />} />
        <Route path="/listings/:id" element={<ListingDetails />} />

        {/* Negotiations */}
        <Route path="/negotiations" element={<NegotiationsList />} />
        <Route path="/negotiations/:id" element={<NegotiationChat />} />

        {/* Orders & Payments */}
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/orders/summary/:orderId" element={<OrderSummary />} />

        {/* Delivery & Tracking */}
        <Route 
          path="/delivery/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delivery/available" 
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryAvailable />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delivery/tasks" 
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryTasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delivery/tasks/:id" 
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="/delivery/track/:id" element={<DeliveryTracking />} />

        {/* Admin Control Center */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Farmer Management */}
        <Route 
          path="/farmer/listings" 
          element={
            <ProtectedRoute allowedRoles={["FARMER"]}>
              <FarmerListings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer/listings/new" 
          element={
            <ProtectedRoute allowedRoles={["FARMER"]}>
              <CreateListing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer/listings/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={["FARMER"]}>
              <EditListing />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div className="p-20 text-center">404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
