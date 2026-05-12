import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content.",
  onRetry,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-red-50/50 rounded-[3rem] border border-red-100 animate-in zoom-in-95 duration-500",
      className
    )}>
      <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 border border-red-100 shadow-xl shadow-red-200/50">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-xs text-sm font-medium text-red-600/70 leading-relaxed mb-8 uppercase tracking-widest text-[10px] font-black">
        {message}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="bg-white border-red-200 text-red-600 hover:bg-red-50 rounded-2xl px-8 font-black text-xs uppercase tracking-[0.2em]"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
