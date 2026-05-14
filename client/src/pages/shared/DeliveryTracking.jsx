import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDeliveryStore } from "@/store/deliveryStore";
import { useAuthStore } from "@/store/authStore";
import DeliveryTimeline from "@/components/delivery/DeliveryTimeline";
import DeliveryStatusActions from "@/components/delivery/DeliveryStatusActions";
import OtpVerificationModal from "@/components/delivery/OtpVerificationModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, 
  Navigation, 
  ShieldCheck,
  Package,
  CircleDot,
  TrendingUp,
  User,
  Phone,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DeliveryTracking = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { 
    activeDelivery, 
    trackingLocation,
    isLoading, 
    fetchDeliveryById, 
    updateStatus, 
    verifyOtp, 
    sendLocationUpdate, 
    startTracking,
    stopTracking,
    resetActiveDelivery 
  } = useDeliveryStore();
  
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  useEffect(() => {
    fetchDeliveryById(id);
    startTracking(id);
    
    return () => {
      stopTracking(id);
      resetActiveDelivery();
    };
  }, [id, fetchDeliveryById, startTracking, stopTracking, resetActiveDelivery]);

  // Simulation: If role is DELIVERY, update location every few seconds
  useEffect(() => {
    if (user?.role === "DELIVERY" && activeDelivery?.status === "IN_TRANSIT") {
       const interval = setInterval(() => {
          // Subtle movement simulation around Bangalore coordinates if null
          const baseLat = trackingLocation?.lat || 12.9716;
          const baseLng = trackingLocation?.lng || 77.5946;
          const lat = baseLat + (Math.random() - 0.5) * 0.001;
          const lng = baseLng + (Math.random() - 0.5) * 0.001;
          sendLocationUpdate(id, lat, lng);
       }, 5000);
       return () => clearInterval(interval);
    }
  }, [user?.role, activeDelivery?.status, id, sendLocationUpdate, trackingLocation]);

  if (isLoading && !activeDelivery) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
         <Skeleton className="h-10 w-48 rounded-full" />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[600px] rounded-[3rem]" />
            <Skeleton className="h-[400px] rounded-[3rem]" />
         </div>
      </div>
    );
  }

  if (!activeDelivery) {
    return (
      <div className="text-center p-20">
        <p className="font-bold text-gray-400 uppercase tracking-widest">Tracking session not found.</p>
        <Link to="/dashboard" className="text-green-600 font-bold mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const isDeliveryPartner = user?.role === "DELIVERY";
  const isBuyer = user?.role === "BUYER";
  const { order, status } = activeDelivery;
  const lastUpdatedAt = trackingLocation?.lastUpdatedAt;
  const lastLat = trackingLocation?.lat;
  const lastLng = trackingLocation?.lng;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
           <Link to={isDeliveryPartner ? "/delivery/dashboard" : "/orders"} className="text-xs font-black text-gray-400 hover:text-green-600 uppercase tracking-widest flex items-center gap-2 mb-4">
              <ArrowLeft className="w-3 h-3" /> Back to List
           </Link>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Live Tracking
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
           </h1>
           <p className="text-sm text-gray-500 font-bold uppercase tracking-tight flex items-center gap-2">
              Order <span className="text-green-600">#{order.id.slice(0, 8)}</span>
              <span className="text-gray-300">•</span>
              {order.listing.productName}
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           {isBuyer && status === "DELIVERED" && (
             <Button 
               onClick={() => setIsOtpModalOpen(true)}
               className="bg-green-600 hover:bg-green-700 px-8 py-6 rounded-2xl font-black shadow-xl shadow-green-200"
             >
                Confirm Arrival
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Map & Partner Info */}
        <div className="lg:col-span-2 space-y-8">
           {/* Map UI Integration */}
           <div className="relative aspect-video lg:aspect-auto lg:h-[500px] bg-[#0A0A0A] rounded-[3rem] border-4 border-gray-900 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 opacity-20 pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                 {/* Map Path Visualization */}
                 <div className="w-full max-w-lg relative h-32 flex items-center justify-between">
                    {/* Route Line */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-800 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-green-500"
                          initial={{ width: "0%" }}
                          animate={{ width: status === "COMPLETED" ? "100%" : status === "DELIVERED" ? "100%" : status === "IN_TRANSIT" ? "60%" : status === "PICKED_UP" ? "20%" : "0%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                       />
                    </div>
                    
                    {/* Pickup Node */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-gray-900 border-4 border-gray-700 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-gray-400" />
                       </div>
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest absolute -bottom-6 whitespace-nowrap">Pickup</span>
                    </div>

                    {/* Destination Node */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                       <div className={cn("w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors duration-500", 
                           status === "COMPLETED" || status === "DELIVERED" ? "bg-green-500 border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.5)]" : "bg-gray-900 border-gray-700"
                       )}>
                          <MapPin className={cn("w-3 h-3", status === "COMPLETED" || status === "DELIVERED" ? "text-white" : "text-gray-400")} />
                       </div>
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest absolute -bottom-6 whitespace-nowrap">Destination</span>
                    </div>

                    {/* Moving Truck */}
                    <motion.div 
                       className="absolute top-1/2 -translate-y-1/2 -ml-6"
                       initial={{ left: "0%" }}
                       animate={{ left: status === "COMPLETED" || status === "DELIVERED" ? "100%" : status === "IN_TRANSIT" ? "60%" : status === "PICKED_UP" ? "20%" : "0%" }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                          <Truck className="w-6 h-6 text-green-600" />
                       </div>
                    </motion.div>
                 </div>

                 <div className="text-center mt-12">
                    <p className="text-xs text-green-400 font-bold uppercase leading-relaxed tracking-[0.3em]">
                       {lastUpdatedAt ? `Last update: ${format(new Date(lastUpdatedAt), "pp")}` : 'Awaiting GPS Signal...'}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                       <CircleDot className="w-3 h-3 text-gray-500" />
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                         {lastLat ? lastLat.toFixed(4) : "0.0000"}, {lastLng ? lastLng.toFixed(4) : "0.0000"}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Status Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                          <Package className="w-6 h-6 text-green-400" />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em]">Arrival Estimate</p>
                          <h4 className="text-lg font-black text-white">{status === "COMPLETED" ? "Arrived" : "12 - 18 Mins"}</h4>
                       </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                       <Navigation className="w-4 h-4 text-green-400" />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Tracking Live</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Delivery Partner Info */}
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden">
                       <User className="w-10 h-10 text-gray-300" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                       <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Logistics Team</p>
                    <h3 className="text-2xl font-black text-gray-900">
                      {activeDelivery.deliveryPartner?.name || "Premium Partner"}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => <CircleDot key={i} className={cn("w-2.5 h-2.5", i < 4 ? "text-green-500 fill-current" : "text-gray-200")} />)}
                          <span className="text-xs font-black text-gray-400 ml-1">4.9 • Verified</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button className="flex-1 md:flex-none p-5 bg-gray-50 hover:bg-green-50 rounded-2xl transition-all border border-gray-100 group">
                    <Phone className="w-6 h-6 text-gray-400 group-hover:text-green-600 mx-auto" />
                 </button>
                 <button className="flex-1 md:flex-none p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 group">
                    <MessageSquare className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mx-auto" />
                 </button>
                 <Button className="flex-[2] md:flex-none bg-gray-900 hover:bg-black px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                    Support
                 </Button>
              </div>
           </div>
        </div>

        {/* Right: Timeline & Actions */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <DeliveryTimeline status={order?.status === "COMPLETED" ? "COMPLETED" : status} updatedAt={lastUpdatedAt} />
           </div>

           {isDeliveryPartner && order?.status !== "COMPLETED" && (
             <DeliveryStatusActions 
               delivery={activeDelivery} 
               onUpdateStatus={(newStatus) => updateStatus(id, newStatus)} 
             />
           )}
           
           {order?.status === "COMPLETED" && (
             <div className="bg-green-50 text-green-800 p-8 rounded-[3rem] text-center shadow-sm border border-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-black mb-2">Mission Complete</h4>
                <p className="text-sm font-medium text-green-700 leading-relaxed">
                   Great job! The produce was delivered securely and funds have been released.
                </p>
             </div>
           )}

           <div className="bg-blue-600 p-8 rounded-[3rem] shadow-xl shadow-blue-200 text-white relative overflow-hidden group">
              <ShieldCheck className="w-10 h-10 text-blue-200 mb-4" />
              <h4 className="text-xl font-black mb-2">Escrow Protection</h4>
              <p className="text-sm font-medium text-blue-100 leading-relaxed">
                 Funds are held securely. Release them only after verifying the produce quality.
              </p>
           </div>
        </div>
      </div>

      <OtpVerificationModal 
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={(otp) => verifyOtp(id, otp)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DeliveryTracking;
