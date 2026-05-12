import { Package, Search, Filter, MoreVertical, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ListingModerationTable = ({ listings }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Marketplace Inventory</h3>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monitor and moderate product listings</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="SEARCH LISTINGS..." 
                className="pl-12 pr-4 py-3 bg-gray-50 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:border-green-600 transition-all w-64"
              />
           </div>
           <button className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Farmer</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 group-hover:border-green-200 transition-all">
                      <img 
                        src={listing.imageUrl || "/assets/hero.png"} 
                        alt={listing.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{listing.productName}</p>
                      <p className="text-[10px] font-black text-green-600 uppercase">₹{listing.pricePerUnit}/{listing.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{listing.farmer?.name || 'Farmer'}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-gray-900 uppercase">{listing.availableQuantity} {listing.unit} Available</span>
                     <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(listing.availableQuantity / listing.totalQuantity) * 100}%` }}
                        />
                     </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest">
                      Live
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-300 hover:text-blue-600 transition-all">
                         <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-red-600 transition-all">
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingModerationTable;
