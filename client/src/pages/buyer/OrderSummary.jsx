import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { 
  ShoppingBag, 
  IndianRupee, 
  Scale, 
  User, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowLeft,
  Info,
  CreditCard,
  Package,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import api from "@/api/axios";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OrderSummary = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPayment, verifyPayment, transactionStatus } = useOrderStore();
  const { addToast } = useUIStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/delivery/my`); 
        const foundDel = response.data.find(d => d.orderId === orderId);
        if (foundDel) {
          setOrder(foundDel.order);
        } else {
          const direct = await api.get(`/delivery/${orderId}`);
          setOrder(direct.data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    try {
      const rzOrder = await createPayment(orderId);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzOrder.amount,
        currency: rzOrder.currency,
        name: "Farm2Door",
        description: `Order for ${order.listing.productName}`,
        order_id: rzOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });
            addToast("Payment successful!", "success");
            navigate(`/orders/${orderId}`);
          } catch (err) {
            addToast("Verification failed: " + err.message, "error");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <Skeleton className="lg:col-span-2 h-[500px] rounded-[3rem]" />
           <Skeleton className="h-[400px] rounded-[3rem]" />
        </div>
      </div>
    );
  }

  if (!order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
      <p className="text-gray-500 font-bold mb-8">We couldn't retrieve the details for this checkout.</p>
      <Link to="/listings">
        <Button variant="secondary">Back to Marketplace</Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 pb-24 pt-4 overflow-hidden">
      {/* Navigation Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-10"
      >
        <Link to="/listings" className="text-[10px] font-black text-gray-400 hover:text-green-600 uppercase tracking-widest transition-colors">Marketplace</Link>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <Link to={`/negotiations/${order.negotiationId}`} className="text-[10px] font-black text-gray-400 hover:text-green-600 uppercase tracking-widest transition-colors">Negotiation</Link>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Final Checkout</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left: Summary (3/5 columns) */}
        <div className="lg:col-span-3 space-y-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-50/50 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-green-100/50 transition-colors duration-700" />
              
              <div className="flex items-center gap-4 mb-12 relative z-10">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                   <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-1">
                   <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Summary</h1>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                     <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified Negotiation Payout
                   </p>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                 <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 hover:border-green-100 transition-colors group/item">
                    <div className="w-full md:w-32 aspect-square rounded-[1.75rem] overflow-hidden shadow-inner bg-white p-2">
                       <img src={order.listing.imageUrl || "/assets/hero.png"} alt={order.listing.productName} className="w-full h-full object-cover rounded-[1.25rem] group-hover/item:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                       <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <span className="px-2 py-0.5 bg-green-100 text-[8px] font-black text-green-700 rounded uppercase tracking-widest">Fresh Harvest</span>
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{order.listing.productName}</h3>
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter flex items-center justify-center md:justify-start gap-1.5">
                         <User className="w-4 h-4" /> 
                         Supplied by <span className="text-gray-900">{order.farmer.name}</span>
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group/card">
                       <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agreed Rate</p>
                          <IndianRupee className="w-4 h-4 text-green-500 group-hover/card:scale-110 transition-transform" />
                       </div>
                       <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900 tracking-tight">₹{order.price}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase ml-1">/ {order.listing.unit}</span>
                       </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group/card">
                       <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purchase Qty</p>
                          <Scale className="w-4 h-4 text-green-500 group-hover/card:scale-110 transition-transform" />
                       </div>
                       <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900 tracking-tight">{order.quantity}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase ml-1">{order.listing.unit}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-dashed border-gray-200 relative z-10">
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.15em]">
                       <span>Negotiated Subtotal</span>
                       <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.15em]">
                       <span>Platform Fee</span>
                       <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.15em]">
                       <span>Logistics Quote</span>
                       <span className="text-gray-900 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> TBD
                       </span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center p-8 bg-green-50/30 rounded-[2.5rem] border border-green-50/50">
                    <div className="space-y-1 mb-4 sm:mb-0">
                       <span className="text-[10px] font-black text-green-700 uppercase tracking-[0.3em]">Total Amount Due</span>
                       <p className="text-[9px] text-green-600 font-black uppercase tracking-tighter">Guaranteed Escrow Protection Included</p>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center justify-end gap-1.5 text-5xl font-black text-green-600 tracking-tighter">
                          <IndianRupee className="w-8 h-8" />
                          <span>{order.totalAmount.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Security Banner */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-100"
           >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
                 <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left space-y-1">
                 <h4 className="font-black uppercase tracking-[0.2em] text-xs">Farm2Door Escrow Protection</h4>
                 <p className="text-xs text-blue-50 font-bold leading-relaxed opacity-80 uppercase tracking-tight">
                    Your funds are held in a secure digital vault and only released to the farmer after you verify successful delivery via secure OTP. Your money is 100% safe.
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Right: Payment Action (2/5 columns) */}
        <div className="lg:col-span-2 space-y-8 sticky top-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-3 bg-green-600" />
              
              <div className="flex flex-col items-center text-center space-y-6 mb-10">
                <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-100 shadow-inner">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-gray-900 uppercase tracking-[0.2em] text-sm">Secure Checkout</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Payment Gateway</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                 <div className="flex justify-between items-center py-4 border-b border-gray-50">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway</span>
                   <span className="text-xs font-black text-gray-900 tracking-tight">RAZORPAY</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-gray-50">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Currency</span>
                   <span className="text-xs font-black text-gray-900 tracking-tight">INR (₹)</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</span>
                   <span className="text-xl font-black text-green-600 tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                 </div>
              </div>

              <Button 
                onClick={handlePayment}
                isLoading={transactionStatus === "PENDING"}
                className="w-full py-8 rounded-[1.5rem] text-xl font-black bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-100 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Pay Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-full bg-white/20 -skew-x-12 z-0"
                />
              </Button>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                 <div className="flex gap-3 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 w-auto object-contain" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 w-auto object-contain" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png" className="h-3 w-auto object-contain mt-0.5" alt="Razorpay" />
                 </div>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                   <Lock className="w-3 h-3" /> PCI-DSS Compliant Secure Server
                 </p>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-4 backdrop-blur-sm"
           >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                 <Info className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Help & Support</p>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                   Have questions about this transaction? <Link to="/support" className="text-green-600 hover:underline">Contact our 24/7 help desk</Link>
                </p>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
