import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeliveryStore } from "@/store/deliveryStore";
import { DashboardHeader, StatCard } from "@/components/DashboardUI";
import { Truck, Package, Clock, CheckCircle, Navigation, ChevronRight, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import DeliveryCard from "@/components/delivery/DeliveryCard";
import { cn } from "@/lib/utils";

const DeliveryTasks = () => {
  const { deliveries, isLoading, fetchMyDeliveries } = useDeliveryStore();
  const [activeTab, setActiveTab] = useState("ASSIGNED");

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const tabs = [
    { id: "ASSIGNED", label: "Assigned", icon: Clock },
    { id: "PICKED_UP", label: "Picked Up", icon: Package },
    { id: "IN_TRANSIT", label: "In Transit", icon: Navigation },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
  ];

  const filteredDeliveries = deliveries.filter(d => d.status === activeTab);

  const stats = [
    { label: "Active", value: deliveries.filter(d => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(d.status)).length, icon: Truck, color: "blue" },
    { label: "Transit", value: deliveries.filter(d => d.status === "IN_TRANSIT").length, icon: Navigation, color: "orange" },
    { label: "Success", value: deliveries.filter(d => d.status === "DELIVERED").length, icon: CheckCircle, color: "green" },
  ];

  return (
    <div className="pb-24 pt-4 px-4 md:px-0">
      <DashboardHeader 
        title="My Deliveries"
        description="Monitor your active logistics pipeline and manage secure handoffs." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 md:p-6 border-b border-gray-50 bg-gray-50/50 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white text-gray-900 shadow-md scale-105" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-green-600" : "text-gray-300")} />
              {tab.label}
              <span className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-[8px]",
                activeTab === tab.id ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
              )}>
                {deliveries.filter(d => d.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />)
            ) : filteredDeliveries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  No deliveries in {activeTab.replace(/_/g, ' ')} status.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredDeliveries.map((delivery) => (
                  <motion.div
                    key={delivery.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <DeliveryCard task={delivery} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTasks;
