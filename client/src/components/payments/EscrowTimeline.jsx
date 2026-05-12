import { ShieldCheck, Lock, CheckCircle2, RefreshCcw, Landmark, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const EscrowTimeline = ({ status, paymentStatus }) => {
  const steps = [
    {
      id: "PAYMENT",
      label: "Payment Secured",
      description: "Buyer's funds are captured and verified via Razorpay.",
      icon: ShieldCheck,
      isCompleted: paymentStatus === "SUCCESS",
      isActive: paymentStatus === "PENDING" || paymentStatus === "SUCCESS",
    },
    {
      id: "HELD",
      label: "Funds in Escrow",
      description: "Money is held safely in our secure digital vault.",
      icon: Lock,
      isCompleted: status === "HELD" || status === "RELEASED",
      isActive: status === "HELD",
    },
    {
      id: "RELEASED",
      label: "Payout Completed",
      description: "Farmer receives the funds after delivery verification.",
      icon: Landmark,
      isCompleted: status === "RELEASED",
      isActive: status === "RELEASED",
    },
  ];

  if (status === "REFUNDED") {
    steps.push({
      id: "REFUNDED",
      label: "Refunded",
      description: "Funds have been returned to the buyer's original payment method.",
      icon: RefreshCcw,
      isCompleted: true,
      isActive: true,
      isError: true,
    });
  }

  // Calculate progress percentage for the line
  const completedSteps = steps.filter(s => s.isCompleted).length;
  const progressHeight = steps.length > 1 ? (completedSteps / (steps.length - 1)) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
    >
      {/* Premium Gradient Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/30 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-green-100/40 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            Escrow Protection
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Secure Transaction System
          </p>
        </div>
        <motion.span 
          layout
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm",
            status === "HELD" ? "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50" :
            status === "RELEASED" ? "bg-green-50 text-green-600 border-green-100 shadow-green-50" :
            status === "REFUNDED" ? "bg-red-50 text-red-600 border-red-100 shadow-red-50" :
            "bg-gray-50 text-gray-600 border-gray-100"
          )}
        >
          {status}
        </motion.span>
      </div>

      <div className="relative space-y-12 pb-2">
        {/* Progress Track Background */}
        <div className="absolute left-[27px] top-4 bottom-4 w-[3px] bg-gray-50 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(progressHeight, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-[27px] top-4 w-[3px] bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)] z-0"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = step.isActive && !step.isCompleted;
          
          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative flex items-start gap-8 group/step"
            >
              <div className="relative">
                <motion.div 
                  className={cn(
                    "w-14 h-14 rounded-[1.25rem] flex items-center justify-center border-2 transition-all duration-700 z-10 relative",
                    step.isCompleted ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" :
                    step.isActive ? "bg-white border-green-500 text-green-600 shadow-xl shadow-green-50" :
                    "bg-white border-gray-100 text-gray-300"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {step.isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-7 h-7" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Icon className={cn("w-7 h-7", isCurrent && "animate-pulse")} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Pulse Effect for Current Step */}
                {isCurrent && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-green-400 rounded-[1.25rem] -z-10"
                  />
                )}
              </div>

              <div className="pt-2">
                <h4 className={cn(
                  "font-black text-sm uppercase tracking-widest mb-1.5 transition-colors duration-500",
                  step.isCompleted ? "text-green-600" : step.isActive ? "text-gray-900" : "text-gray-400"
                )}>
                  {step.label}
                </h4>
                <p className={cn(
                  "text-[11px] font-bold leading-relaxed max-w-[220px] transition-colors duration-500",
                  step.isActive || step.isCompleted ? "text-gray-500" : "text-gray-300"
                )}>
                  {step.description}
                </p>
                
                {isCurrent && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">In Progress</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Footer */}
      <div className="mt-12 pt-8 border-t border-gray-50 relative z-10">
        <div className="flex items-start gap-4 p-5 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              Buyer Protection <Info className="w-3 h-3 text-gray-400" />
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-tight">
              Funds are held by Farm2Door and only released to the farmer after you verify successful delivery via secure OTP.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EscrowTimeline;
