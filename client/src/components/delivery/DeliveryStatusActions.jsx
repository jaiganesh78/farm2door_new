import { useState, useRef } from "react";
import { Truck, Package, MapPin, CheckCircle2, ChevronRight, Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useUIStore } from "@/store/uiStore";
import { useDeliveryStore } from "@/store/deliveryStore";

const DeliveryStatusActions = ({ delivery, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useUIStore();
  const { uploadProofImage } = useDeliveryStore();

  const statusMap = {
    ASSIGNED: {
      next: "PICKED_UP",
      label: "Mark Picked Up",
      icon: Package,
      color: "bg-blue-600",
      desc: "Are you at the farm? Confirm collection of produce."
    },
    PICKED_UP: {
      next: "IN_TRANSIT",
      label: "Start Delivery",
      icon: Truck,
      color: "bg-orange-600",
      desc: "Starting the journey to the buyer's location."
    },
    IN_TRANSIT: {
      next: "DELIVERED",
      label: "Arrived at Destination",
      icon: MapPin,
      color: "bg-green-600",
      desc: "Confirm you have reached the buyer."
    },
    DELIVERED: {
      label: "Waiting for Verification",
      icon: CheckCircle2,
      color: "bg-gray-400",
      desc: "Buyer is entering the OTP to finalize."
    }
  };

  const currentAction = statusMap[delivery.status];

  const handleAction = async () => {
    if (!currentAction?.next) return;
    setLoading(true);
    try {
      await onUpdateStatus(currentAction.next);
      addToast(`Status updated to ${currentAction.next}`, "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadProofImage(delivery.id, file);
      addToast("Proof of delivery uploaded!", "success");
    } catch (err) {
      addToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  if (!currentAction) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl ${currentAction.color} flex items-center justify-center text-white shadow-lg`}>
          <currentAction.icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Workflow</p>
          <h3 className="text-xl font-black text-gray-900">{currentAction.label}</h3>
        </div>
      </div>

      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
        {currentAction.desc}
      </p>

      {delivery.status !== "DELIVERED" ? (
        <Button 
          onClick={handleAction}
          isLoading={loading}
          disabled={uploading}
          className={`w-full py-8 rounded-2xl text-lg font-black ${currentAction.color} hover:opacity-90 shadow-xl transition-all active:scale-95`}
        >
          {currentAction.label} <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <div className="space-y-4">
           <input 
             type="file" 
             accept="image/*" 
             className="hidden" 
             ref={fileInputRef}
             onChange={handleImageUpload}
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={uploading}
             className="w-full flex items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-dashed border-gray-300 transition-all group"
           >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
              ) : delivery.proofImageUrl ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Camera className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              )}
              <span className="text-xs font-bold text-gray-500 uppercase">
                {uploading ? "Uploading..." : delivery.proofImageUrl ? "Proof Uploaded" : "Upload Delivery Proof"}
              </span>
           </button>
           
           <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <p className="text-[10px] font-bold text-green-800 uppercase tracking-tight">
                Ask the buyer for the 4-digit confirmation code.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusActions;
