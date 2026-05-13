import { useEffect } from "react";
import { useListingStore } from "@/store/listingStore";
import ListingGrid from "@/components/listings/ListingGrid";
import ListingFilters from "@/components/listings/ListingFilters";
import PageTransition from "@/components/ui/PageTransition";
import { Leaf, Sprout, TrendingUp, Sparkles } from "lucide-react";

const Marketplace = () => {
  const { listings, isLoading, fetchListings } = useListingStore();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <PageTransition>
      <div className="pb-20">
        {/* Hero Section - Refined with deeper glassmorphism and motion */}
        <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 p-10 md:p-20 mb-16 shadow-2xl shadow-green-900/20">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20 shadow-xl">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              Direct from local farms
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight">
              Freshness <br />
              <span className="text-emerald-300">Simplified.</span>
            </h1>
            <p className="text-xl text-emerald-50/80 mb-12 leading-relaxed font-medium max-w-xl">
              Connect with verified farmers in your area. Secure payments, real-time tracking, and produce that's actually fresh.
            </p>
            
            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Sprout className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white font-black text-xl leading-none mb-1">100%</p>
                  <p className="text-emerald-200/50 text-[10px] font-black uppercase tracking-widest">Organic Root</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <TrendingUp className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white font-black text-xl leading-none mb-1">Fair</p>
                  <p className="text-emerald-200/50 text-[10px] font-black uppercase tracking-widest">Market Price</p>
                </div>
              </div>
            </div>
          </div>

          {/* Optimized Hero Image */}
          <div className="hidden lg:block absolute bottom-0 right-0 w-2/5 h-[90%] pointer-events-none">
             <img 
              src="/assets/hero.png" 
              alt="Fresh Produce" 
              className="w-full h-full object-contain object-bottom drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] animate-in slide-in-from-right-8 duration-1000 delay-300"
             />
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Marketplace</h2>
              <div className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Currently Harvesting Near Bangalore
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-green-600">{listings.length}</span> verified sources
              </p>
            </div>
          </div>

          <ListingFilters />
          
          <div className="mt-12">
            <ListingGrid listings={listings} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Marketplace;
