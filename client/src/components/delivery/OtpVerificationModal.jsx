import { useState } from "react";
import { X, ShieldCheck, ArrowRight, Lock, KeyRound } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useUIStore } from "@/store/uiStore";

const OtpVerificationModal = ({ isOpen, onClose, onVerify, isLoading }) => {
  const [otp, setOtp] = useState("");
  const { addToast } = useUIStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      return addToast("Please enter a valid 4-digit OTP", "error");
    }
    try {
      await onVerify(otp);
      addToast("Delivery verified & funds released!", "success");
      onClose();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10 text-center">
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center border border-green-100 shadow-inner">
                <Lock className="w-10 h-10 text-green-600" />
             </div>
          </div>

          <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Confirm Delivery</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 px-4">
             Enter the 4-digit code provided by the buyer to finalize the transaction and release funds from escrow.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative max-w-[200px] mx-auto">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 z-10" />
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="0000"
                autoFocus
                className="w-full pl-12 pr-4 py-6 bg-gray-50 border-2 border-gray-100 rounded-2xl text-3xl font-black tracking-[0.5em] text-center focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-gray-900"
              />
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                isLoading={isLoading}
                className="w-full py-8 rounded-[2rem] text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 transition-all"
              >
                Verify & Release Funds <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button 
                type="button"
                onClick={onClose}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Cancel Verification
              </button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50/50 px-10 py-5 border-t border-blue-100 flex items-center gap-3">
           <ShieldCheck className="w-5 h-5 text-blue-600" />
           <p className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">
             Secure verification powered by Farm2Door Escrow
           </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
