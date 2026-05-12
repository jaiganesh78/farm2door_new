import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DeliveryTimeline = ({ status, updatedAt }) => {
  const steps = [
    {
      id: "ASSIGNED",
      label: "Assigned",
      description: "A delivery partner is coming to the farm.",
      icon: User,
      isCompleted: ["PICKED_UP", "IN_TRANSIT", "DELIVERED", "COMPLETED"].includes(status),
      isActive: status === "ASSIGNED",
    },
    {
      id: "PICKED_UP",
      label: "Picked Up",
      description: "Produce has been harvested and collected.",
      icon: Package,
      isCompleted: ["IN_TRANSIT", "DELIVERED", "COMPLETED"].includes(status),
      isActive: status === "PICKED_UP",
    },
    {
      id: "IN_TRANSIT",
      label: "In Transit",
      description: "Your order is on the way to your location.",
      icon: Truck,
      isCompleted: ["DELIVERED", "COMPLETED"].includes(status),
      isActive: status === "IN_TRANSIT",
    },
    {
      id: "DELIVERED",
      label: "Arrived",
      description: "Partner has arrived. Please provide OTP.",
      icon: MapPin,
      isCompleted: status === "COMPLETED" || status === "DELIVERED",
      isActive: status === "DELIVERED",
    },
    {
      id: "COMPLETED",
      label: "Verified",
      description: "Delivery confirmed and funds released.",
      icon: CheckCircle2,
      isCompleted: status === "COMPLETED",
      isActive: status === "COMPLETED",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Fulfillment Timeline
        </h3>
        {updatedAt && (
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
             Updated {format(new Date(updatedAt), "h:mm a")}
           </span>
        )}
      </div>

      <div className="relative space-y-1">
        {/* Connector Line */}
        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-100" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative flex items-start gap-6 pb-8 last:pb-0 group">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 z-10",
                step.isCompleted ? "bg-green-600 border-green-600 text-white" :
                step.isActive ? "bg-white border-green-600 text-green-600 shadow-xl shadow-green-100 animate-pulse" :
                "bg-white border-gray-100 text-gray-300"
              )}>
                {step.isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
              </div>

              <div className="pt-2 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn(
                    "font-black text-sm uppercase tracking-widest",
                    step.isCompleted ? "text-green-600" : step.isActive ? "text-gray-900" : "text-gray-400"
                  )}>
                    {step.label}
                  </h4>
                  {step.isActive && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  )}
                </div>
                <p className={cn(
                  "text-xs font-medium leading-relaxed",
                  step.isActive ? "text-gray-600" : "text-gray-400"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
         <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
         <p className="text-[10px] font-bold text-orange-800 uppercase leading-relaxed tracking-tight">
           Please do not share your OTP with the delivery partner until you have thoroughly inspected the produce quality.
         </p>
      </div>
    </div>
  );
};

export default DeliveryTimeline;
