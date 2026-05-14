import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Package,
  Map as MapIcon,
} from "lucide-react";
import { useDeliveryStore } from "@/store/deliveryStore";
import { useUIStore } from "@/store/uiStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { DashboardHeader } from "@/components/DashboardUI";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const DeliveryAvailable = () => {
  const {
    availableMissions,
    isLoading,
    fetchAvailableMissions,
    acceptMission,
  } = useDeliveryStore();

  const addToast = useUIStore((state) => state.addToast);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableMissions();
  }, [fetchAvailableMissions]);

  const handleAccept = async (orderId) => {
    try {
      const delivery = await acceptMission(orderId);

      addToast("Mission Accepted! Route synchronized.", "success");

      navigate(`/delivery/tasks/${delivery.id}`);
    } catch (err) {
      addToast(err.message || "Failed to accept mission", "error");
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 md:px-0">
      <DashboardHeader
        title="Available Missions"
        description="Select optimized logistics routes and maximize your earnings."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 w-full rounded-[2.5rem]"
            />
          ))
        ) : availableMissions.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <Truck className="w-10 h-10 text-gray-200" />
            </div>

            <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-center max-w-xs">
              No available missions found in your region. Check back soon.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {availableMissions.map((mission) => (
              <motion.div
                key={mission.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={mission.listing.imageUrl || "/assets/hero.png"}
                    alt={mission.listing.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">
                        Mission Product
                      </p>

                      <h3 className="text-lg font-black text-white">
                        {mission.listing.productName}
                      </h3>
                    </div>

                    <div className="bg-green-500 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
                      ₹{mission.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-2 h-2" />
                        Pickup
                      </p>

                      <p className="text-[10px] font-bold text-gray-900 truncate uppercase">
                        {mission.farmer.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <MapIcon className="w-2 h-2" />
                        Destination
                      </p>

                      <p className="text-[10px] font-bold text-gray-900 truncate uppercase">
                        {mission.buyer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-y border-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />

                      <span className="text-[10px] font-black text-gray-900 uppercase">
                        Est. 45 Mins
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />

                      <span className="text-[10px] font-black text-gray-900 uppercase">
                        {mission.quantity} {mission.listing.unit}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAccept(mission.id)}
                    className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-green-600 text-white font-black uppercase tracking-[0.2em] transition-all duration-300 group/btn shadow-xl shadow-gray-200"
                  >
                    <span className="flex items-center gap-2">
                      Accept Mission

                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DeliveryAvailable;