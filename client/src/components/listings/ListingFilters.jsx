import { Search, SlidersHorizontal, X, IndianRupee, Scale, ChevronDown } from "lucide-react";
import { useListingStore } from "@/store/listingStore";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { cn } from "@/lib/utils";

const ListingFilters = () => {
  const { filters, setFilters, clearFilters } = useListingStore();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, setFilters, filters.search]);

  const activeFiltersCount = [
    filters.minPrice, 
    filters.maxPrice, 
    filters.minQty
  ].filter(Boolean).length;

  return (
    <div className="mb-12 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar - Refined interaction */}
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 group-focus-within:scale-110 transition-all duration-300" />
          <input
            type="text"
            placeholder="Search for apples, tomatoes, or local farms..."
            className="w-full pl-16 pr-6 py-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Filter Toggle - Modern styling */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center justify-center gap-3 px-8 py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 border shadow-sm",
            showFilters
              ? "bg-gray-900 text-white border-gray-900 shadow-xl"
              : "bg-white text-gray-900 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Refine
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full text-[8px] font-black animate-in zoom-in">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showFilters && "rotate-180")} />
        </button>
      </div>

      {/* Expanded Filters - Clean Grid */}
      {showFilters && (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <button 
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
             >
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Search Parameters</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adjust price and quantity limits</p>
            </div>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-[10px] font-black text-red-500 hover:text-red-700 flex items-center gap-2 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                Reset All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <IndianRupee className="w-3 h-3" />
                Minimum Price
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ minPrice: e.target.value })}
                className="rounded-2xl border-gray-100 py-6 font-bold"
              />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <IndianRupee className="w-3 h-3" />
                Maximum Price
              </label>
              <Input
                type="number"
                placeholder="No limit"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: e.target.value })}
                className="rounded-2xl border-gray-100 py-6 font-bold"
              />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Scale className="w-3 h-3" />
                Min Quantity
              </label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.minQty}
                onChange={(e) => setFilters({ minQty: e.target.value })}
                className="rounded-2xl border-gray-100 py-6 font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingFilters;
