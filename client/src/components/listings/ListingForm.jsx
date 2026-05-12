import { useState, useRef } from "react";
import { useListingStore } from "@/store/listingStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Package, 
  IndianRupee, 
  Scale, 
  MapPin, 
  Image as ImageIcon, 
  X, 
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const ListingForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    productName: initialData?.productName || "",
    description: initialData?.description || "",
    pricePerUnit: initialData?.pricePerUnit || "",
    unit: initialData?.unit || "kg",
    totalQuantity: initialData?.totalQuantity || "",
    latitude: initialData?.latitude || "12.9716",
    longitude: initialData?.longitude || "77.5946",
    negotiable: initialData?.negotiable ?? true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              General Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                <Input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. Organic Roma Tomatoes"
                  required
                  className="rounded-xl border-gray-100 py-6"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your produce (quality, harvest date, etc.)"
                  className="w-full min-h-[120px] p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price per Unit (₹)</label>
                <Input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="rounded-xl border-gray-100 py-6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="piece">Piece (pc)</option>
                  <option value="bundle">Bundle</option>
                  <option value="box">Box</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Quantity</label>
                <Input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="rounded-xl border-gray-100 py-6"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-bold text-gray-700 uppercase tracking-tight">Allow Negotiation</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Meta */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              Produce Media
            </h3>
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="relative aspect-square rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-green-200 transition-all overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-black text-sm uppercase tracking-widest">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 uppercase tracking-tighter">Upload Photo</p>
                  <p className="text-xs text-gray-400 font-medium">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Farm Location
            </h3>
            <div className="space-y-4">
               <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-[10px] font-bold text-green-800 uppercase leading-relaxed tracking-tight">
                    By default, your registered farm coordinates will be used. You can adjust them if needed.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="rounded-xl border-gray-100"
                  />
                  <Input
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="rounded-xl border-gray-100"
                  />
               </div>
            </div>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading}
            className="w-full py-8 rounded-[2rem] text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 transition-all"
          >
            {initialData ? "Update Listing" : "Publish Listing"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ListingForm;
