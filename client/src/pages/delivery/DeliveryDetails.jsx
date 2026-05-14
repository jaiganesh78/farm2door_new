import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useDeliveryStore } from "@/store/deliveryStore";
import EscrowTimeline from "@/components/payments/EscrowTimeline";
import DeliveryStatusActions from "@/components/delivery/DeliveryStatusActions";
import OtpVerificationModal from "@/components/delivery/OtpVerificationModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, Package, Truck, MapPin, User, IndianRupee, Clock, ChevronRight, CheckCircle2, Navigation
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    activeDelivery, 
    isLoading, 
    fetchDeliveryById, 
    updateStatus, 
    verifyOtp, 
    resetActiveDelivery,
    startTracking,
    stopTracking
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

  if (isLoading && !activeDelivery) {
    return (
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-12 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Skeleton className="h-12 w-64 rounded-2xl" />
              <Skeleton className="h-4 w-48 rounded-full" />
            </div>
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="lg:col-span-2 h-[500px] rounded-[3rem]" />
           <div className="space-y-8">
             <Skeleton className="h-[300px] rounded-[3rem]" />
             <Skeleton className="h-[200px] rounded-[3rem]" />
           </div>
        </div>
      </div>
    );
  }

  if (!activeDelivery) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-20">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Mission Not Found</h2>
      <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest leading-relaxed">
        We couldn't locate the mission details you requested.
      </p>
      <Link to="/delivery/tasks">
        <Button variant="secondary" className="px-10 rounded-2xl font-black">Back to Assignments</Button>
      </Link>
    </div>
  );

  const { order, status } = activeDelivery;
  const payment = order?.payment;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24 pt-4 overflow-hidden animate-in fade-in duration-700">
      {/* Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-8"
      >
        <Link to="/delivery/tasks" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
        </Link>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Assignments</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Mission #{activeDelivery.id.slice(0, 8)}</span>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Mission Control</h1>
           <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                 Order #{order.id.slice(0, 8)}
              </span>
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap items-center gap-4"
        >
           <Link to={`/delivery/track/${activeDelivery.id}`}>
             <Button className="bg-white text-green-600 border-2 border-green-100 hover:border-green-600 hover:bg-green-50 px-6 py-3 rounded-2xl font-black shadow-none flex items-center gap-2">
               <Navigation className="w-4 h-4" /> Live Map
             </Button>
           </Link>
           <div className={cn(
             "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm",
             status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-100" : "bg-orange-50 text-orange-700 border-orange-100"
           )}>
              <div className={cn(
                "w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20", 
                status === "COMPLETED" ? "bg-green-600 ring-green-600" : "bg-orange-600 ring-orange-600 animate-pulse"
              )} />
              {status.replace(/_/g, ' ')}
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Product & Actors */}
        <div className="lg:col-span-2 space-y-10">
           {/* Product Info */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="w-full md:w-48 aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                   <img src={order?.listing?.imageUrl || "/assets/hero.png"} alt={order?.listing?.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-8 w-full">
                   <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black text-gray-500 rounded uppercase tracking-widest">Cargo Details</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{order?.listing?.productName}</h2>
                   </div>
                   <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                      <div className="space-y-1.5">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity to Deliver</p>
                         <div className="flex items-center gap-1 text-2xl font-black text-gray-900 tracking-tight">
                            <span>{order?.quantity}</span>
                            <span className="text-xs text-gray-400 font-bold uppercase ml-1">{order?.listing?.unit}</span>
                         </div>
                      </div>
                      <div className="space-y-1.5 border-l border-gray-50 pl-6">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mission Payout</p>
                         <div className="flex items-center gap-1 text-2xl font-black text-green-600 tracking-tight">
                            <IndianRupee className="w-5 h-5" />
                            <span>{order?.totalAmount?.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </motion.div>

           {/* Actor Details: Farmer & Buyer */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="grid grid-cols-1 md:grid-cols-2 gap-6"
           >
              {/* Pickup */}
              <div className="bg-gray-50/80 p-8 rounded-[3rem] border border-gray-100 backdrop-blur-sm shadow-sm space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                       <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pickup From</p>
                       <p className="text-base font-black text-gray-900">{order?.farmer?.name}</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-gray-200/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Location</p>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed">
                      Coordinates: {order?.listing?.latitude}, {order?.listing?.longitude}<br />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 block">Farm Location</span>
                    </p>
                 </div>
              </div>
              
              {/* Destination */}
              <div className="bg-gray-50/80 p-8 rounded-[3rem] border border-gray-100 backdrop-blur-sm shadow-sm space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                       <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deliver To</p>
                       <p className="text-base font-black text-gray-900">{order?.buyer?.name}</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-gray-200/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Destination Address</p>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed">
                      7th Main Road, Koramangala<br />
                      Bengaluru, Karnataka 560034<br />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 block">Buyer Location</span>
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Right: Actions & Timeline */}
        <div className="space-y-10">
           {order?.status !== "COMPLETED" && (
             <DeliveryStatusActions 
               delivery={activeDelivery} 
               onUpdateStatus={(newStatus) => updateStatus(id, newStatus)} 
             />
           )}
           {status === "DELIVERED" && order?.status !== "COMPLETED" && (
             <Button 
               onClick={() => setIsOtpModalOpen(true)}
               className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-2xl font-black shadow-xl shadow-green-200"
             >
                Enter Buyer OTP
             </Button>
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

           <EscrowTimeline 
             status={payment?.escrowStatus || "PENDING"} 
             paymentStatus={order?.paymentStatus} 
           />
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

export default DeliveryDetails;
