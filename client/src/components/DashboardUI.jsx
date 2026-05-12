import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, Info, ShieldCheck, ZapIcon } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = ({ title, description }) => {
  const { user } = useAuthStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
        {title || `Welcome back, ${user?.name?.split(" ")[0]}!`}
      </h1>
      {description && (
        <p className="text-sm md:text-base text-gray-400 font-bold mt-2 max-w-2xl uppercase tracking-tighter leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

const StatCard = ({ label, value, icon: Icon, color = "green" }) => {
  const colors = {
    green: "bg-green-50 text-green-600 ring-green-100/50 shadow-green-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100/50 shadow-blue-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100/50 shadow-orange-100",
    red: "bg-red-50 text-red-600 ring-red-100/50 shadow-red-100",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/40 border border-gray-100 flex items-center gap-6 relative overflow-hidden group transition-all duration-300 hover:border-green-100"
    >
      <div className={cn(
        "p-5 rounded-2xl ring-4 transition-all duration-500 group-hover:scale-110 shadow-lg",
        colors[color]
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight leading-none group-hover:text-green-600 transition-colors duration-500">{value}</p>
      </div>
      
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-green-50/50 transition-colors duration-500" />
    </motion.div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, to, color = "green" }) => {
  const colors = {
    green: "hover:bg-green-50/50 hover:border-green-200 border-gray-100",
    blue: "hover:bg-blue-50/50 hover:border-blue-200 border-gray-100",
    orange: "hover:bg-orange-50/50 hover:border-orange-200 border-gray-100",
  };

  const iconColors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <Link to={to} className="block group">
      <motion.div 
        whileHover={{ x: 5 }}
        className={cn(
          "bg-white p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between",
          colors[color]
        )}
      >
        <div className="flex items-center gap-5">
           <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12", iconColors[color])}>
              <Icon className="w-6 h-6" />
           </div>
           <div>
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest">{title}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{description}</p>
           </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
           <ChevronRight className="w-5 h-5" />
        </div>
      </motion.div>
    </Link>
  );
};

const WorkflowGuide = ({ steps = [] }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/40 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-10">
         <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white fill-current" />
         </div>
         <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">System Playbook</h3>
      </div>

      <div className="space-y-10 relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />
        
        {steps.map((step, i) => (
          <div key={i} className="relative flex items-start gap-6">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all font-black text-xs",
              step.completed ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-200 text-gray-400"
            )}>
              {i + 1}
            </div>
            <div>
               <h4 className={cn("text-xs font-black uppercase tracking-[0.15em] mb-1", step.completed ? "text-green-600" : "text-gray-900")}>
                 {step.title}
               </h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-xs">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50">
         <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <div className="space-y-1">
               <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest">Platform Integrity</p>
               <p className="text-[9px] text-blue-600 font-bold uppercase leading-relaxed tracking-tight">
                 All transitions are secured via digital escrow and real-time OTP verification protocols.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export { DashboardHeader, StatCard, QuickActionCard, WorkflowGuide };
