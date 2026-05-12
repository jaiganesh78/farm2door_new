import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useNegotiationStore } from "@/store/negotiationStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import OfferTimeline from "@/components/negotiations/OfferTimeline";
import NegotiationModal from "@/components/negotiations/NegotiationModal";
import { Skeleton } from "@/components/ui/Skeleton";
import PageTransition from "@/components/ui/PageTransition";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Info,
  Package,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NegotiationChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeNegotiation, isLoading, fetchNegotiation, respondToOffer, createOffer,error } = useNegotiationStore();
  const { addToast } = useUIStore();
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  useEffect(() => {
    fetchNegotiation(id);
    const interval = setInterval(() => fetchNegotiation(id), 5000); 
    return () => clearInterval(interval);
  }, [id, fetchNegotiation]);

  const handleResponse = async (status) => {
    try {
      const action = status === "ACCEPTED" ? "ACCEPT" : "REJECT";
      await respondToOffer(id, { action });
      addToast(`Offer ${status.toLowerCase()} successfully`, "success");
      fetchNegotiation(id);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleCounterOffer = async (formData) => {
    try {
      if (user.role === "FARMER") {
        await respondToOffer(id, {
          action: "COUNTER",
          ...formData
        });
      } else {
        await createOffer({
          listingId: activeNegotiation.listingId,
          ...formData
        });
      }
      fetchNegotiation(id);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (isLoading && !activeNegotiation) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
         <Skeleton className="h-10 w-32 rounded-full" />
         <div className="bg-white rounded-[3rem] border border-gray-100 h-[700px] overflow-hidden shadow-sm">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
               <Skeleton className="h-10 w-64 rounded-xl" />
               <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>
            <div className="p-10 space-y-10">
               <Skeleton className="h-32 w-2/3 rounded-[2.5rem]" />
               <Skeleton className="h-32 w-2/3 ml-auto rounded-[2.5rem]" />
            </div>
         </div>
      </div>
    );
  }

  if (error || (!isLoading && !activeNegotiation)) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Discussion Not Found</h2>
        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest leading-relaxed">The negotiation session you're looking for could not be retrieved.</p>
        <Link to="/negotiations">
          <Button variant="secondary" className="px-10 rounded-2xl font-black">Back to discussions</Button>
        </Link>
      </div>
    );
  }

  const offers = activeNegotiation?.offers || [];
  const lastOffer = offers.length > 0 ? offers[offers.length - 1] : null;
  const canRespond = activeNegotiation?.status === "ACTIVE" && lastOffer && lastOffer.senderRole !== user.role;
  const isAccepted = activeNegotiation?.status === "ACCEPTED";
  const isRejected = activeNegotiation?.status === "REJECTED";

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link 
              to="/negotiations" 
              className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-green-600 transition-colors group mb-4 uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              All Discussions
            </Link>
            <div className="flex items-center gap-4">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">Direct Negotiation</h1>
               <div className={cn(
                 "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
                 isAccepted ? "bg-green-50 text-green-600 border-green-100" : 
                 isRejected ? "bg-red-50 text-red-600 border-red-100" : 
                 "bg-blue-50 text-blue-600 border-blue-100"
               )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", isAccepted ? "bg-green-500" : isRejected ? "bg-red-500" : "bg-blue-500 animate-pulse")} />
                  {activeNegotiation?.status}
               </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secured Session
             </div>
             <div className="w-px h-6 bg-gray-100" />
             <Link to={`/listings/${activeNegotiation?.listingId}`}>
                <Button variant="secondary" className="rounded-xl font-black py-4 px-6 h-auto">
                   View Item <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col min-h-[750px] relative">
          {/* Listing Preview Strip */}
          <div className="p-8 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between gap-6">
             <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-white border border-gray-200 shadow-sm ring-4 ring-white">
                   <img 
                    src={activeNegotiation?.listing?.imageUrl || "/assets/hero.png"} 
                    alt={activeNegotiation?.listing?.productName} 
                    className="w-full h-full object-cover" 
                   />
                </div>
                <div>
                   <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">Subject Property</p>
                   <h2 className="text-2xl font-black text-gray-900 leading-none">{activeNegotiation?.listing?.productName || "Product Discussion"}</h2>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Baseline:</span>
                      <span className="text-xs font-black text-gray-900">₹{activeNegotiation?.listing?.pricePerUnit}/{activeNegotiation?.listing?.unit}</span>
                   </div>
                </div>
             </div>
             <div className="hidden sm:flex flex-col items-end text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Negotiating With</p>
                <p className="font-black text-gray-900 truncate max-w-[150px]">{user.role === 'FARMER' ? 'Buyer Account' : activeNegotiation?.listing?.farmer?.name || "Farmer"}</p>
             </div>
          </div>

          {/* Timeline Container */}
          <div className="flex-1 bg-white relative">
             <OfferTimeline offers={offers} />
             
             {/* Dynamic Overlays for Terminal States */}
             {isAccepted && (
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-white via-white to-transparent pt-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                   <div className="bg-green-600 p-10 rounded-[2.5rem] shadow-2xl shadow-green-200 text-white flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-8 border border-white/30 shadow-xl">
                         <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-black mb-3">Consensus Reached!</h3>
                      <p className="text-green-50 font-medium max-w-md leading-relaxed text-lg mb-10 opacity-90">
                         The negotiation has successfully concluded. Terms have been recorded in the platform ledger.
                      </p>
                      {user.role === 'BUYER' && activeNegotiation?.order?.id && (
                         <Link to={`/orders/summary/${activeNegotiation.order.id}`} className="w-full max-w-xs">
                            <Button className="w-full py-8 rounded-2xl bg-white text-green-700 hover:bg-green-50 font-black text-lg shadow-xl uppercase tracking-widest">
                               Complete Checkout
                            </Button>
                         </Link>
                      )}
                      {user.role === 'FARMER' && (
                         <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/20">
                            <Info className="w-5 h-5" />
                            <p className="text-sm font-bold uppercase tracking-widest">Awaiting Buyer Payment</p>
                         </div>
                      )}
                   </div>
                </div>
             )}

             {isRejected && (
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-white via-white to-transparent pt-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mb-6">
                         <XCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <h3 className="text-2xl font-black mb-2">Discussion Closed</h3>
                      <p className="text-gray-400 font-medium max-w-sm text-sm">
                         This negotiation session has been terminated without agreement. You can start a new discussion from the marketplace.
                      </p>
                   </div>
                </div>
             )}
          </div>

          {/* Persistent Action Bar */}
          {canRespond && (
             <div className="p-8 md:p-10 bg-gray-50 border-t border-gray-100 z-20 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row gap-5">
                   <Button 
                     onClick={() => handleResponse("ACCEPTED")}
                     className="flex-1 py-8 rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 font-black text-sm uppercase tracking-widest"
                   >
                      Accept Current Terms
                   </Button>
                   <Button 
                     onClick={() => setIsCounterModalOpen(true)}
                     variant="outline"
                     className="flex-1 py-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 font-black text-sm uppercase tracking-widest transition-all"
                   >
                      Send Counter Bid
                   </Button>
                   <Button 
                     onClick={() => handleResponse("REJECTED")}
                     variant="ghost"
                     className="px-8 py-8 rounded-2xl font-black text-xs text-gray-400 hover:text-red-600 uppercase tracking-widest"
                   >
                      Decline
                   </Button>
                </div>
                <div className="mt-8 flex items-center justify-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Awaiting your action on the latest offer
                   </p>
                </div>
             </div>
          )}
        </div>
      </div>

      <NegotiationModal 
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        listing={activeNegotiation?.listing}
        onSubmit={handleCounterOffer}
        isCounter={true}
      />
    </PageTransition>
  );
};

export default NegotiationChat;
