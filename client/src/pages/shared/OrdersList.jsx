import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";
import { DashboardHeader } from "@/components/DashboardUI";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Calendar, User } from "lucide-react";
import { 
  ShoppingBag, 
  ArrowRight, 
  IndianRupee, 
  Scale, 
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const OrdersList = () => {
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-24 pt-4 px-2 md:px-0">
      <DashboardHeader 
        title="Transaction History" 
        description="Monitor your secure escrow payments and real-time delivery progress." 
      />

      <div className="mt-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] border border-gray-100 p-16 text-center shadow-xl shadow-gray-100/50"
          >
             <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShoppingBag className="w-12 h-12 text-green-600" />
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">No Transactions Yet</h3>
             <p className="text-gray-400 font-bold max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
                Your secure purchase history will appear here. Start by exploring the marketplace for fresh produce.
             </p>
             <Link to="/listings" className="inline-block mt-10">
                <Button className="px-10 py-5 rounded-2xl shadow-green-100">
                   Enter Marketplace
                </Button>
             </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-8"
          >
            {orders.map((order) => {
              const isPaid = order.paymentStatus === 'SUCCESS';
              const isCompleted = order.status === 'COMPLETED';
              
              return (
                <motion.div key={order.id} variants={item}>
                  <Link 
                    to={`/orders/${order.id}`}
                    className="group bg-white p-6 md:p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-green-100/30 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden"
                  >
                    {/* Subtle Gradient Accent */}
                    <div className={cn(
                      "absolute top-0 left-0 w-1.5 h-full transition-all duration-500",
                      isPaid ? "bg-green-500" : "bg-orange-400"
                    )} />

                    <div className="flex items-center gap-6 md:gap-8 flex-1">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-105 transition-all duration-700 shadow-inner">
                            <img 
                              src={order.listing.imageUrl || "/assets/hero.png"} 
                              alt={order.listing.productName} 
                              className="w-full h-full object-cover" 
                            />
                        </div>
                        {isPaid && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm flex items-center gap-1.5",
                              isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                            )}>
                                {isPaid ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    Payment Secured
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" />
                                    Pending Payment
                                  </>
                                )}
                            </span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(order.createdAt), "MMM d")}
                            </span>
                          </div>
                          
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-green-600 transition-colors leading-tight">
                            {order.listing.productName}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 isCompleted ? "bg-green-500" : "bg-blue-500 animate-pulse"
                               )} />
                               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                 {order.status.replace(/_/g, ' ')}
                               </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <User className="w-3.5 h-3.5 text-gray-400" />
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 Farmer: <span className="text-gray-900">{order.farmer.name}</span>
                               </span>
                            </div>
                          </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-10 p-6 md:p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 group-hover:border-green-100 group-hover:bg-green-50/50 transition-all duration-500">
                      <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Value</p>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                            <span className="text-2xl font-black text-gray-900 tracking-tight">
                              {order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                      </div>
                      
                      <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                      
                      <div className="space-y-1 hidden sm:block">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Purchase Qty</p>
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">{order.quantity}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">{order.listing.unit}</span>
                          </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-gray-100 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm ml-4">
                          <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
