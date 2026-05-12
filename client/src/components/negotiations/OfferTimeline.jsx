import { IndianRupee, Scale, Clock, MessageSquare, User, CheckCircle2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const OfferCard = ({ offer, isLast }) => {
  const { user } = useAuthStore();
  const isMine = offer.senderRole === user.role;

  return (
    <div className={cn(
      "flex flex-col mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
      isMine ? "items-end" : "items-start"
    )}>
      {/* Sender Header */}
      <div className={cn(
        "flex items-center gap-3 mb-3 px-2",
        isMine ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-500 hover:rotate-12",
          isMine ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
           <User className={cn("w-4 h-4", isMine ? "text-white" : "text-gray-400")} />
        </div>
        <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
           <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">
              {isMine ? "You" : (offer.senderRole === "FARMER" ? "Farmer" : "Buyer")}
           </span>
           <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
              {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
           </span>
        </div>
      </div>

      {/* Offer Content */}
      <div className={cn(
        "relative max-w-[90%] sm:max-w-md p-7 rounded-[2.5rem] shadow-xl transition-all duration-500 hover:shadow-2xl",
        isMine 
          ? "bg-green-600 text-white rounded-tr-none shadow-green-200/50" 
          : "bg-white border border-gray-100 text-gray-900 rounded-tl-none shadow-gray-200/40"
      )}>
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className={cn(
             "p-4 rounded-2xl transition-colors",
             isMine ? "bg-white/10 hover:bg-white/15" : "bg-gray-50 hover:bg-gray-100"
           )}>
              <p className={cn(
                "text-[8px] font-black uppercase tracking-widest mb-1.5",
                isMine ? "text-green-100" : "text-gray-400"
              )}>Bid Price</p>
              <div className="flex items-center gap-1.5">
                 <IndianRupee className={cn("w-4 h-4", isMine ? "text-green-200" : "text-green-600")} />
                 <span className="text-2xl font-black leading-none tracking-tight">₹{offer.price}</span>
              </div>
           </div>
           <div className={cn(
             "p-4 rounded-2xl transition-colors",
             isMine ? "bg-white/10 hover:bg-white/15" : "bg-gray-50 hover:bg-gray-100"
           )}>
              <p className={cn(
                "text-[8px] font-black uppercase tracking-widest mb-1.5",
                isMine ? "text-green-100" : "text-gray-400"
              )}>Bid Qty</p>
              <div className="flex items-center gap-1.5">
                 <Scale className={cn("w-4 h-4", isMine ? "text-green-200" : "text-green-600")} />
                 <span className="text-2xl font-black leading-none tracking-tight">{offer.quantity}</span>
              </div>
           </div>
        </div>

        {offer.message && (
          <div className={cn(
            "flex gap-3 p-4 rounded-2xl relative overflow-hidden group/msg",
            isMine ? "bg-black/10 text-green-50" : "bg-green-50/50 text-gray-600 border border-green-100/50"
          )}>
             <div className={cn(
               "absolute top-0 left-0 w-1 h-full",
               isMine ? "bg-green-300/30" : "bg-green-500/20"
             )} />
             <MessageSquare className={cn("w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover/msg:scale-110", isMine ? "text-green-200" : "text-green-600")} />
             <p className="text-sm font-medium italic leading-relaxed">"{offer.message}"</p>
          </div>
        )}

        {isLast && (
           <div className="absolute -bottom-1 -right-1">
              <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
           </div>
        )}
      </div>
    </div>
  );
};

const OfferTimeline = ({ offers }) => {
  return (
    <div className="flex flex-col p-4 sm:p-10 overflow-y-auto max-h-[700px] scrollbar-hide">
      <div className="flex flex-col items-center mb-16 relative">
         <div className="px-6 py-2 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-sm z-10">
            Protocol Initiated
         </div>
         <div className="absolute top-full w-px h-12 bg-gradient-to-b from-gray-100 to-transparent" />
      </div>

      <div className="space-y-4">
         {offers.map((offer, index) => (
           <OfferCard 
             key={offer.id} 
             offer={offer} 
             isLast={index === offers.length - 1} 
           />
         ))}
      </div>
    </div>
  );
};

export default OfferTimeline;
