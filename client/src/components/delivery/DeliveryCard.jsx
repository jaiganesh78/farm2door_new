import { Truck, MapPin, Package, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const DeliveryCard = ({ task }) => {
  const isPending = task.status === "ASSIGNED";
  const isInProgress = ["PICKED_UP", "IN_TRANSIT"].includes(task.status);
  
  return (
    <Link 
      to={`/delivery/tasks/${task.id}`}
      className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:row md:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-green-200 transition-all">
          <img 
            src={task.order.listing.imageUrl || "/assets/hero.png"} 
            alt="Product" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
              isPending ? "bg-blue-50 text-blue-600" : 
              isInProgress ? "bg-orange-50 text-orange-600" : 
              "bg-green-50 text-green-600"
            )}>
              {task.status.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] font-bold text-gray-300 uppercase">
              {formatDistanceToNow(new Date(task.assignedAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className="text-lg font-black text-gray-900 group-hover:text-green-600 transition-colors">
            {task.order.listing.productName}
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase mt-1">
            Order #{task.orderId.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
          <p className="text-xs font-bold text-gray-900">Buyer Location</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all ml-4">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
};

export default DeliveryCard;
