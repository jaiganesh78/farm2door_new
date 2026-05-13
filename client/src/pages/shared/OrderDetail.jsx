import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import EscrowTimeline from "@/components/payments/EscrowTimeline";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  User, 
  IndianRupee, 
  Scale, 
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Navigation,
  CheckCircle2,
  Receipt,
  Download,
  Share2,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import api from "@/api/axios";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Direct order fetch failed, trying fallback:", err);
        try {
          const deliveryResponse = await api.get(`/delivery/my`);
          const found = deliveryResponse.data.find(d => d.orderId === id || d.id === id);
          if (found) {
            setOrder(found.order);
          }
        } catch (innerErr) {
          console.error("Fallback fetch failed:", innerErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
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

  if (!order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-20">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
      <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest leading-relaxed">
        We couldn't locate the transaction details you requested. It may have been archived or removed from the system.
      </p>
      <Link to="/orders">
        <Button variant="secondary" className="px-10 rounded-2xl font-black">Go back to history</Button>
      </Link>
    </div>
  );

  const payment = order?.payment;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24 pt-4 overflow-hidden animate-in fade-in duration-700">
      {/* Breadcrumb & Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-8"
      >
        <Link to="/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
        </Link>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order History</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">#{order?.id?.slice(0, 8)}</span>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Order Details</h1>
           <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                 #{order?.id?.slice(0, 8)}
              </span>
              <span className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-gray-400" />
                 {order?.createdAt ? format(new Date(order.createdAt), "PPP") : "N/A"}
              </span>
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap items-center gap-4"
        >
           {order?.delivery?.id && ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"].includes(order?.status) && (
             <Link to={`/delivery/track/${order.delivery.id}`}>
               <Button className="bg-white text-green-600 border-2 border-green-100 hover:border-green-600 hover:bg-green-50 px-6 py-3 rounded-2xl font-black shadow-none flex items-center gap-2">
                 <Navigation className="w-4 h-4" /> Track Live
               </Button>
             </Link>
           )}
           <div className={cn(
             "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm",
             order?.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-100" : 
             order?.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-100" :
             "bg-blue-50 text-blue-700 border-blue-100"
           )}>
              <div className={cn(
                "w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20", 
                order?.status === "COMPLETED" ? "bg-green-600 ring-green-600" : 
                order?.status === "CANCELLED" ? "bg-red-600 ring-red-600" :
                "bg-blue-600 ring-blue-600 animate-pulse"
              )} />
              {order?.status?.replace(/_/g, ' ') || "PENDING"}
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Product & Timeline */}
        <div className="lg:col-span-2 space-y-10">
           {/* Product Card - SaaS Style */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="w-full md:w-56 aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                   <img src={order?.listing?.imageUrl || "/assets/hero.png"} alt={order?.listing?.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-8 w-full">
                   <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black text-gray-500 rounded uppercase tracking-widest">Premium Produce</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{order?.listing?.productName || "Product Detail"}</h2>
                      <p className="text-sm text-gray-400 font-bold flex items-center justify-center md:justify-start gap-1.5 uppercase tracking-tighter">
                        <User className="w-4 h-4" /> 
                        Supplied by <span className="text-gray-900">{order?.farmer?.name || "Verified Farmer"}</span>
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                      <div className="space-y-1.5">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Net Value</p>
                         <div className="flex items-center gap-1 text-2xl font-black text-green-600 tracking-tight">
                            <IndianRupee className="w-5 h-5" />
                            <span>{order?.totalAmount?.toLocaleString() || "0"}</span>
                         </div>
                      </div>
                      <div className="space-y-1.5 border-l border-gray-50 pl-6">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity</p>
                         <div className="flex items-center gap-1 text-2xl font-black text-gray-900 tracking-tight">
                            <span>{order?.quantity || "0"}</span>
                            <span className="text-xs text-gray-400 font-bold uppercase ml-1">{order?.listing?.unit || "unit"}</span>
                         </div>
                      </div>
                      <div className="hidden md:block space-y-1.5 border-l border-gray-50 pl-6">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price / {order?.listing?.unit || "unit"}</p>
                         <div className="flex items-center gap-1 text-2xl font-black text-gray-400 tracking-tight">
                            <span className="text-sm">₹</span>
                            <span>{order?.price || "0"}</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </motion.div>

           {/* Fulfillment Progress */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40"
           >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                     <Truck className="w-5 h-5 text-green-600" />
                   </div>
                   Fulfillment Track
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                  Real-time Status
                </span>
              </div>
              
              <div className="relative space-y-12">
                 {/* Progress line */}
                 <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-50 rounded-full" />
                 
                 {[
                   { status: "CONFIRMED", label: "Order Confirmed", desc: "Payment successfully verified. Inventory has been securely reserved.", icon: CheckCircle2, date: order?.createdAt },
                   { status: "ASSIGNED", label: "Logistics Assigned", desc: "Our delivery partner is being dispatched to pick up your order.", icon: User, date: order?.delivery?.assignedAt },
                   { status: "IN_TRANSIT", label: "Produce in Transit", desc: "Your fresh produce is currently on the move to your location.", icon: Truck, date: null },
                   { status: "COMPLETED", label: "Verification & Delivery", desc: "Successfully delivered and verified via secure OTP system.", icon: Package, date: order?.delivery?.deliveredAt },
                 ].map((step, index) => {
                   const isCompleted = order?.status === "COMPLETED" ? true :
                                     order?.status === step.status || (index === 0 && order?.status !== "PENDING") ||
                                     (index === 1 && ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "COMPLETED"].includes(order?.status)) ||
                                     (index === 2 && ["IN_TRANSIT", "DELIVERED", "COMPLETED"].includes(order?.status));
                   
                   const isActive = order?.status === step.status;
                   const StepIcon = step.icon;
                   
                   return (
                     <div key={step.label} className="relative flex items-start gap-8 group">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500 ring-4 ring-white shadow-sm",
                          isCompleted ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" :
                          isActive ? "bg-white border-green-600 text-green-600 shadow-xl shadow-green-50" :
                          "bg-white border-gray-100 text-gray-300"
                        )}>
                           <StepIcon className="w-6 h-6" />
                        </div>
                        <div className="pt-2">
                           <h4 className={cn(
                             "text-sm font-black uppercase tracking-widest mb-1.5", 
                             isCompleted ? "text-green-600" : isActive ? "text-gray-900" : "text-gray-400"
                           )}>
                              {step.label}
                           </h4>
                           <p className="text-[11px] text-gray-500 font-bold leading-relaxed max-w-md">{step.desc}</p>
                           {step.date && (
                             <div className="flex items-center gap-1.5 mt-2.5">
                                <Clock className="w-3 h-3 text-gray-300" />
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                   {format(new Date(step.date), "MMM d, yyyy • h:mm a")}
                                </p>
                             </div>
                           )}
                        </div>
                     </div>
                   );
                 })}
              </div>
           </motion.div>
        </div>

        {/* Right: Payment & Escrow */}
        <div className="space-y-10">
           <EscrowTimeline 
             status={payment?.escrowStatus || "PENDING"} 
             paymentStatus={order?.paymentStatus} 
           />

           {/* Payment Receipt Card */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40 relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-8">Transaction Info</h3>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                        <CreditCard className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{payment?.method || "RAZORPAY"}</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-[10px] font-bold text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded truncate max-w-[120px]">
                      {payment?.transactionId ? `${payment.transactionId.slice(0, 14)}...` : "ID_PENDING_VERIF"}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Escrow Status</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      payment?.escrowStatus === "RELEASED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {payment?.escrowStatus || "WAITING"}
                    </span>
                 </div>
                 
                 <div className="pt-6 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Disbursed</p>
                         <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Tax & Fees Included</p>
                       </div>
                       <div className="text-right">
                         <p className="text-3xl font-black text-green-600 tracking-tight">₹{order?.totalAmount?.toLocaleString() || "0"}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {order?.paymentStatus !== "SUCCESS" && user?.role === "BUYER" && (
                <Button
                onClick={() => navigate(`/orders/summary/${order.id}`)}
                className="w-full mt-10 py-5 rounded-[1.5rem] font-black group"
              >
                 Complete Payment
                 <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
              )}
           </motion.div>

           {/* User & Shipping */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-gray-50/80 p-8 rounded-[3rem] border border-gray-100 space-y-8 backdrop-blur-sm shadow-sm"
           >
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                    <User className="w-6 h-6 text-gray-400" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Purchased by</p>
                    <p className="text-base font-black text-gray-900 truncate">{order?.buyer?.name || "Premium Account"}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">{order?.buyer?.email || "verified@farm2door.com"}</p>
                 </div>
              </div>
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                    <MapPin className="w-6 h-6 text-red-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Shipping Destination</p>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed">
                      7th Main Road, Koramangala<br />
                      Bengaluru, Karnataka 560034<br />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 block">India</span>
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
