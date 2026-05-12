import { Link } from "react-router-dom";
import { MapPin, User, Scale, BadgeCheck, ArrowRight, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

const ListingCard = ({ listing, index = 0 }) => {
  const {
    id,
    productName,
    pricePerUnit,
    unit,
    availableQuantity,
    imageUrl,
    negotiable,
    farmer,
  } = listing;

  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        to={`/listings/${id}`}
        className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img
            src={imageUrl || "/assets/hero.png"}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {negotiable && (
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-green-700 uppercase tracking-widest border border-white shadow-xl">
              Negotiable
            </div>
          )}

          <div className="absolute bottom-4 right-4 z-20 bg-gray-900 px-4 py-2 rounded-2xl text-white shadow-2xl flex items-baseline gap-1 transform transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-600">
            <span className="text-[10px] font-black opacity-70 uppercase tracking-tighter">₹</span>
            <span className="font-black text-lg leading-none">{pricePerUnit}</span>
            <span className="text-[10px] font-bold opacity-60">/{unit}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-7 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
              {productName}
            </h3>
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shrink-0">
               <BadgeCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="space-y-3.5 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                 <User className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs font-bold text-gray-500 truncate uppercase tracking-tight">
                 {farmer?.name || "Premium Farmer"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="flex items-center gap-2 p-2.5 bg-gray-50/50 rounded-xl border border-gray-100">
                  <Scale className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{availableQuantity} {unit}</span>
               </div>
               <div className="flex items-center gap-2 p-2.5 bg-gray-50/50 rounded-xl border border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">2.4 KM</span>
               </div>
            </div>
          </div>

          <div className="mt-7 pt-6 border-t border-gray-50 flex items-center justify-between group/btn">
            <span className="text-[10px] font-black text-gray-300 group-hover:text-green-600 transition-colors uppercase tracking-[0.2em]">
              Explore Source
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-green-600 group-hover:text-white group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-green-200">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
