import { useEffect } from "react";
import { Truck, MapPin, CheckCircle, Package, Navigation, ShieldCheck, Map as MapIcon, History } from "lucide-react";
import { useDeliveryStore } from "@/store/deliveryStore";
import { Skeleton } from "@/components/ui/Skeleton";
import DeliveryCard from "@/components/delivery/DeliveryCard";
import { DashboardHeader, StatCard, QuickActionCard, WorkflowGuide } from "@/components/DashboardUI";
import { motion } from "framer-motion";

const DeliveryDashboard = () => {
  const { deliveries, isLoading, fetchMyDeliveries } = useDeliveryStore();

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const activeTasks = deliveries.filter(d => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"].includes(d.status));
  const completedTasks = deliveries.filter(d => d.status === "COMPLETED");

  return (
    <div className="pb-24 pt-4 px-2 md:px-0">
      <DashboardHeader 
        description="Synchronize your logistics route and verify secure handoffs in real-time." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <StatCard label="Live Missions" value={activeTasks.length} icon={Truck} color="blue" />
        <StatCard label="In Transit" value={deliveries.filter(d => d.status === "IN_TRANSIT").length} icon={Navigation} color="orange" />
        <StatCard label="Confirmed" value={completedTasks.length} icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div>
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                 Active Missions
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                 {isLoading ? (
                   [...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />)
                 ) : activeTasks.length === 0 ? (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-16 text-center shadow-inner"
                   >
                      <Package className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                        No active missions assigned. New logistics requests will appear here.
                      </p>
                   </motion.div>
                 ) : (
                   activeTasks.map((task) => (
                     <DeliveryCard key={task.id} task={task} />
                   ))
                 )}
              </div>
           </div>

           <div>
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                 Quick Logistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <QuickActionCard 
                   title="Route Planner" 
                   description="Optimize multiple drops" 
                   icon={MapIcon} 
                   to="/dashboard"
                   color="blue"
                 />
                 <QuickActionCard 
                   title="Mission History" 
                   description="View past deliveries" 
                   icon={History} 
                   to="/dashboard"
                   color="orange"
                 />
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <WorkflowGuide 
             steps={[
               { title: "Mission Intake", description: "Receive optimized logistics assignments from the platform.", completed: true },
               { title: "Farm Pickup", description: "Verify produce quality and initiate secure transit.", completed: true },
               { title: "Live Transit", description: "Broadcast real-time location to both buyer and farmer.", completed: false },
               { title: "OTP Handoff", description: "Complete delivery via secure buyer verification code.", completed: false },
             ]}
           />

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Recent Performance</h3>
              <div className="space-y-4">
                 {completedTasks.slice(0, 3).map(task => (
                   <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <p className="text-[10px] font-black text-gray-900 truncate uppercase">{task.order.listing.productName}</p>
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">Verified Success</span>
                   </div>
                 ))}
                 {completedTasks.length === 0 && (
                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center py-4 italic">No completed history</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
