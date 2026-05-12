import ListingCard from "./ListingCard";
import { Skeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { ShoppingBag } from "lucide-react";

const ListingGrid = ({ listings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 space-y-6 shadow-sm">
            <Skeleton className="aspect-[4/3] w-full rounded-[1.5rem]" />
            <div className="space-y-3">
               <Skeleton className="h-6 w-3/4 rounded-lg" />
               <Skeleton className="h-4 w-1/4 rounded-lg" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <EmptyState 
        icon={ShoppingBag}
        title="No fresh produce found"
        description="Try adjusting your filters or search terms. We're constantly adding new harvests to the marketplace."
        className="py-32"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} index={index} />
      ))}
    </div>
  );
};

export default ListingGrid;
