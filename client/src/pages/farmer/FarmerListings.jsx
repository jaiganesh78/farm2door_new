import { useEffect, useState } from "react";
import { useListingStore } from "@/store/listingStore";
import { useUIStore } from "@/store/uiStore";
import { DashboardHeader, StatCard } from "@/components/DashboardUI";
import { 
  Plus, 
  Package, 
  Edit3, 
  Trash2, 
  Eye, 
  MoreVertical,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Scale
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const FarmerListings = () => {
  const { myListings, isLoading, fetchMyListings, deleteListing } = useListingStore();
  const { addToast } = useUIStore();
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setIsDeleting(id);
      try {
        await deleteListing(id);
        addToast("Listing deleted successfully", "success");
      } catch (err) {
        addToast(err.message, "error");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const totalInventory = myListings.reduce((acc, curr) => acc + curr.availableQuantity, 0);
  const activeListings = myListings.length;

  return (
    <div className="pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <DashboardHeader 
          title="My Listings" 
          description="Manage your inventory and marketplace presence." 
        />
        <Link to="/farmer/listings/new">
          <Button className="bg-green-600 hover:bg-green-700 rounded-2xl px-6 py-6 shadow-xl shadow-green-200 font-black flex items-center gap-2 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Active Listings" value={activeListings} icon={Package} color="green" />
        <StatCard label="Total Inventory" value={`${totalInventory} Units`} icon={Scale} color="blue" />
        <StatCard label="Visibility" value="84%" icon={TrendingUp} color="orange" />
      </div>

      {/* Listings Table/Grid */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-lg" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : myListings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                     <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                           <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">No listings found</h4>
                        <p className="text-xs text-gray-500 mb-6">Start selling your fresh produce by creating your first listing.</p>
                        <Link to="/farmer/listings/new">
                           <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 font-bold">
                              Create Listing
                           </Button>
                        </Link>
                     </div>
                  </td>
                </tr>
              ) : (
                myListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                          <img 
                            src={listing.imageUrl || "/assets/hero.png"} 
                            alt={listing.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{listing.productName}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: {listing.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-baseline gap-0.5">
                        <span className="font-black text-gray-900 text-lg">₹{listing.pricePerUnit}</span>
                        <span className="text-gray-400 text-xs font-bold">/{listing.unit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${listing.availableQuantity < 5 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {listing.availableQuantity}
                        </span>
                        <span className="text-gray-400 text-xs font-medium">{listing.unit}</span>
                        {listing.availableQuantity < 5 && (
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Live
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/listings/${listing.id}`}>
                           <Button variant="ghost" className="w-9 h-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                             <Eye className="w-4 h-4" />
                           </Button>
                        </Link>
                        <Link to={`/farmer/listings/edit/${listing.id}`}>
                           <Button variant="ghost" className="w-9 h-9 p-0 rounded-xl hover:bg-green-50 hover:text-green-600">
                             <Edit3 className="w-4 h-4" />
                           </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-9 h-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(listing.id)}
                          isLoading={isDeleting === listing.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerListings;
