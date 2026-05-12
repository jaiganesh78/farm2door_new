import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useListingStore } from "@/store/listingStore";
import { useUIStore } from "@/store/uiStore";
import ListingForm from "@/components/listings/ListingForm";
import { DashboardHeader } from "@/components/DashboardUI";
import { Skeleton } from "@/components/ui/Skeleton";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, fetchListingById, updateListing, uploadListingImage, isLoading } = useListingStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchListingById(id);
  }, [id, fetchListingById]);

  const handleSubmit = async (formData, imageFile) => {
    try {
      await updateListing(id, formData);
      
      if (imageFile) {
        await uploadListingImage(id, imageFile);
      }
      
      addToast("Listing updated successfully!", "success");
      navigate("/farmer/listings");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (isLoading && !currentListing) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-20 w-1/2 rounded-2xl" />
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="col-span-2 h-[500px] rounded-[2rem]" />
          <Skeleton className="h-[500px] rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (!currentListing) return null;

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      <DashboardHeader 
        title={`Edit: ${currentListing.productName}`} 
        description="Update your listing details or inventory status." 
      />
      <ListingForm 
        initialData={currentListing} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default EditListing;
