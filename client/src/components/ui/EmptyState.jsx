import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  description = "There are no items to display at the moment.",
  children,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 animate-in fade-in duration-700",
      className
    )}>
      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="max-w-xs text-sm font-medium text-gray-400 leading-relaxed mb-8">
        {description}
      </p>
      {children}
    </div>
  );
};

export default EmptyState;
