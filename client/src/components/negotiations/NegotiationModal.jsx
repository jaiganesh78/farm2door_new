import { useState } from "react";
import { X, IndianRupee, Scale, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useUIStore } from "@/store/uiStore";

const NegotiationModal = ({ isOpen, onClose, listing, onSubmit, isCounter = false }) => {
  const [formData, setFormData] = useState({
    price: listing?.pricePerUnit || "",
    quantity: listing?.availableQuantity || "",
    message: "",
  });
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      addToast(isCounter ? "Counter offer transmitted!" : "Offer protocol initiated!", "success");
      onClose();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">
                    Negotiation v2.4
                 </div>
                 <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                {isCounter ? "Propose Counter" : "Submit Bid"}
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                {listing?.productName} • {listing?.unit} Scale
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Unit Price (₹)</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 transition-transform group-focus-within:scale-110" />
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    required
                    className="pl-12 pr-6 rounded-[1.5rem] border-gray-100 py-8 text-lg font-black focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Lot Size ({listing?.unit})</label>
                <div className="relative group">
                  <Scale className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 transition-transform group-focus-within:scale-110" />
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0"
                    required
                    className="pl-12 pr-6 rounded-[1.5rem] border-gray-100 py-8 text-lg font-black focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Offer Justification (Optional)</label>
              <div className="relative group">
                <MessageCircle className="absolute left-5 top-5 w-4 h-4 text-gray-400 transition-transform group-focus-within:scale-110" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Explain your reasoning to the partner..."
                  className="w-full min-h-[120px] pl-12 pr-6 py-5 bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1 py-8 rounded-2xl border-2 border-gray-100 font-black uppercase text-xs tracking-widest"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                isLoading={loading}
                className="flex-[2] py-8 rounded-2xl font-black bg-gray-900 hover:bg-black text-white shadow-2xl transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
              >
                <Send className="w-4 h-4 mr-2" />
                Transmit Offer
              </Button>
            </div>
          </form>
        </div>

        {/* Dynamic Footer */}
        <div className="bg-gray-50 px-10 py-6 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Real-time notification active
              </p>
           </div>
           <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              Secured by Farm2Door
           </p>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
