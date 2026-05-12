import { Loader2 } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const LoadingOverlay = ({ isVisible, message = "Processing...", blur = true }) => {
  const globalLoading = useUIStore((state) => state.isLoading);
  const show = isVisible !== undefined ? isVisible : globalLoading;

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[999] flex items-center justify-center animate-in fade-in duration-300",
      blur ? "bg-white/40 backdrop-blur-md" : "bg-white/80"
    )}>
      <div className="flex flex-col items-center gap-4 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-500">
        <div className="relative">
           <div className="w-16 h-16 rounded-full border-4 border-green-50" />
           <Loader2 className="absolute top-0 left-0 w-16 h-16 text-green-600 animate-spin stroke-[3px]" />
        </div>
        <p className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mt-2">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
