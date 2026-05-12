import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNegotiationStore } from "@/store/negotiationStore";
import { Skeleton } from "@/components/ui/Skeleton";
import PageTransition from "@/components/ui/PageTransition";
import EmptyState from "@/components/ui/EmptyState";
import { 
  MessageSquare, 
  ArrowRight, 
  IndianRupee, 
  Scale, 
  Clock,
  User,
  ShoppingBag,
  History,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "@/api/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const NegotiationsList = () => {
  const { negotiationsList, setList, isLoading } = useNegotiationStore();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await api.get("/negotiations/list/all"); 
        setList(response.data);
      } catch (err) {
        console.error("Failed to fetch negotiations", err);
      }
    };
    fetchList();
  }, [setList]);

  return (
    <PageTransition>
      <div className="pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Price Negotiations</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Track your active bids and direct-to-source discussions</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:row items-center gap-6">
                 <Skeleton className="w-20 h-20 rounded-2xl" />
                 <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/4 rounded-lg" />
                 </div>
                 <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
            ))
          ) : negotiationsList.length === 0 ? (
            <EmptyState 
              icon={MessageSquare}
              title="No active negotiations"
              description="Find products you like and make an offer to start a discussion with a farmer."
              className="py-24"
            >
               <Link to="/listings">
                  <Button className="bg-green-600 hover:bg-green-700 rounded-2xl px-10 font-black shadow-xl shadow-green-200">
                     Go to Marketplace
                  </Button>
               </Link>
            </EmptyState>
          ) : (
            negotiationsList.map((neg, index) => {
              const lastOffer = neg.offers[neg.offers.length - 1];
              return (
                <Link 
                  key={neg.id} 
                  to={`/negotiations/${neg.id}`}
                  className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-500 flex flex-col md:row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-green-200 transition-all shadow-inner">
                           <img 
                             src={neg.listing.imageUrl || "/assets/hero.png"} 
                             alt={neg.listing.productName} 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg",
                          neg.status === 'ACTIVE' ? 'bg-blue-500' : 
                          neg.status === 'ACCEPTED' ? 'bg-green-500' : 'bg-red-500'
                        )}>
                           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className={cn(
                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                             neg.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                             neg.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                           )}>
                              {neg.status}
                           </span>
                           <span className="text-[10px] font-black text-gray-300 tracking-tighter uppercase flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(neg.createdAt), { addSuffix: true })}
                           </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors leading-tight">{neg.listing.productName}</h3>
                        <div className="flex items-center gap-4 mt-2.5">
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-green-50 transition-colors">
                              <User className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600" />
                              <span className="text-[10px] font-bold text-gray-500 group-hover:text-green-700 uppercase tracking-tight truncate max-w-[120px]">
                                {neg.listing.farmer.name}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-6 px-8 py-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 group-hover:border-green-100 group-hover:bg-green-50/30 transition-all shadow-inner">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Last Offer</p>
                        <div className="flex items-center gap-1.5 justify-center">
                           <IndianRupee className="w-4 h-4 text-green-600" />
                           <span className="text-2xl font-black text-gray-900 tracking-tight">₹{lastOffer?.price}</span>
                        </div>
                     </div>
                     <div className="w-px h-12 bg-gray-200/50" />
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Quantity</p>
                        <div className="flex items-center gap-1.5 justify-center">
                           <Scale className="w-4 h-4 text-green-600" />
                           <span className="text-2xl font-black text-gray-900 tracking-tight">{lastOffer?.quantity}</span>
                        </div>
                     </div>
                     <div className="hidden lg:flex w-12 h-12 rounded-2xl bg-white border border-gray-100 items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all ml-4 shadow-sm group-hover:rotate-12">
                        <ArrowRight className="w-6 h-6" />
                     </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default NegotiationsList;
