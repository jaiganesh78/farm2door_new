import { useUIStore } from "@/store/uiStore";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const Toaster = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-white border shadow-lg rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300",
            toast.type === "error" ? "border-red-100" : "border-gray-100"
          )}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
