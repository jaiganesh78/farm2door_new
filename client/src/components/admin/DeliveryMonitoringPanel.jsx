import { Truck, MapPin, Package, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const DeliveryMonitoringPanel = ({ deliveries }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <div>
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Deliveries</h3>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time logistics monitoring</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping" />
           <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-50">
        {deliveries.length === 0 ? (
          <div className="p-20 text-center">
             <Truck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No active deliveries tracked.</p>
          </div>
        ) : (
          deliveries.slice(0, 10).map((delivery) => (
            <div key={delivery.id} className="p-8 flex flex-col lg:row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all group">
               <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                    delivery.status === "IN_TRANSIT" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                    delivery.status === "DELIVERED" ? "bg-green-50 text-green-600 border border-green-100" :
                    "bg-blue-50 text-blue-600 border border-blue-100"
                  )}>
                     <Truck className="w-8 h-8" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                          delivery.status === "IN_TRANSIT" ? "bg-orange-100 text-orange-700" :
                          delivery.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                           {delivery.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase">#{delivery.id.slice(0, 8)}</span>
                     </div>
                     <h4 className="text-lg font-black text-gray-900">Partner: {delivery.deliveryPartner?.name || "Premium Partner"}</h4>
                  </div>
               </div>

               <div className="flex items-center gap-12">
                  <div className="hidden sm:block">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Route Info</p>
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-900">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-green-600" /> Farm</span>
                        <div className="w-8 h-px bg-gray-200" />
                        <span className="flex items-center gap-1"><Package className="w-3 h-3 text-blue-600" /> Buyer</span>
                     </div>
                  </div>
                  <Link 
                    to={`/delivery/track/${delivery.id}`}
                    className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                     Track Live <ExternalLink className="w-3 h-3" />
                  </Link>
               </div>
            </div>
          ))
        )}
      </div>
      
      {deliveries.length > 10 && (
        <button className="w-full py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 bg-gray-50/50 transition-all">
           View All Logistics Activities
        </button>
      )}
    </div>
  );
};

export default DeliveryMonitoringPanel;
