import { useNavigate } from "react-router-dom";
import { useListingStore } from "@/store/listingStore";
import { useUIStore } from "@/store/uiStore";
import ListingForm from "@/components/listings/ListingForm";
import { DashboardHeader } from "@/components/DashboardUI";

const CreateListing = () => {
  const navigate = useNavigate();
  const { createListing, uploadListingImage, isLoading } = useListingStore();
  const { addToast } = useUIStore();

  const handleSubmit = async (formData, imageFile) => {
    try {
      const listing = await createListing(formData);
      
      if (imageFile) {
        await uploadListingImage(listing.id, imageFile);
      }
      
      addToast("Listing published successfully!", "success");
      navigate("/farmer/listings");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      <DashboardHeader 
        title="Create New Listing" 
        description="Fill in the details to publish your produce to the marketplace." 
      />
      <ListingForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateListing;
