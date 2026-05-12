import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useListingStore } from "@/store/listingStore";
import { useNegotiationStore } from "@/store/negotiationStore";
import { useUIStore } from "@/store/uiStore";
import NegotiationModal from "@/components/negotiations/NegotiationModal";
import { Skeleton } from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Scale, 
  BadgeCheck, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  Navigation,
  Star,
  Sprout,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, isLoading, error, fetchListingById } = useListingStore();
  const { createOffer } = useNegotiationStore();
  const { addToast } = useUIStore();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    fetchListingById(id);
  }, [id, fetchListingById]);

  const handleOfferSubmit = async (formData) => {
    try {
      const response = await createOffer({
        listingId: id,
        ...formData
      });
      // Response is { negotiation, offer }
      navigate(`/negotiations/${response.negotiation.id}`);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (isLoading && !currentListing) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-4 pt-8">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !currentListing)) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Listing Not Found</h2>
        <p className="text-gray-500 font-bold mb-8">The harvest you're looking for might have been sold or removed.</p>
        <Link to="/listings">
          <Button variant="secondary">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const {
    productName,
    description,
    pricePerUnit,
    unit,
    availableQuantity,
    imageUrl,
    negotiable,
    farmer,
  } = currentListing;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <Link 
        to="/listings" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-green-50 group-hover:border-green-200 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="relative group">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-2xl shadow-gray-200/50">
            <img 
              src={imageUrl || "/assets/hero.png"} 
              alt={productName} 
              className="w-full h-full object-cover"
            />
          </div>
          {negotiable && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-green-700 uppercase tracking-widest border border-green-100 shadow-xl">
              Negotiable Price
            </div>
          )}
        </div>

        {/* Right: Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Sprout className="w-4 h-4" />
              Premium Produce
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
              {productName}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              {description || "Freshly harvested produce directly from the local farm. High quality, organic, and pesticide-free."}
            </p>
          </div>

          {/* Price & Quantity Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price per unit</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">₹{pricePerUnit}</span>
                <span className="text-gray-500 font-bold text-sm">/ {unit}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Stock</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">{availableQuantity}</span>
                <span className="text-gray-500 font-bold text-sm">{unit} left</span>
              </div>
            </div>
          </div>

          {/* Farmer Info */}
          <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                <User className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Verified Farmer</p>
                <p className="text-lg font-bold text-gray-900">{farmer?.name || "Premium Farmer"}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                   <Clock className="w-3 h-3" />
                   Usually responds in 2 hours
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end">
                <div className="flex gap-0.5 text-yellow-400">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-3 h-3 fill-current" />
                   ))}
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 italic">48 Happy Buyers</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-4 pt-4">
            <Button 
              onClick={() => negotiable ? setIsOfferModalOpen(true) : navigate(`/orders/new?listingId=${id}`)}
              className="w-full py-7 rounded-2xl text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 transition-all active:scale-[0.98]"
            >
              {negotiable ? "Make an Offer" : "Order Now"}
            </Button>
            
            <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-100 mt-4">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure Escrow
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Navigation className="w-4 h-4 text-green-500" />
                  Live Tracking
               </div>
            </div>
          </div>

          {/* Location Info (Mock) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h4 className="font-bold text-gray-900 flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-red-500" />
                 Farm Location
               </h4>
               <span className="text-xs font-bold text-green-600">2.4 km away</span>
             </div>
             <div className="w-full h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium italic">
                Interactive map will be loaded here
             </div>
          </div>
        </div>
      </div>

      <NegotiationModal 
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        listing={currentListing}
        onSubmit={handleOfferSubmit}
      />
    </div>
  );
};

export default ListingDetails;
