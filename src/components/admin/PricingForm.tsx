
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadProductImage } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const PricingForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(
    initialData || {
      package_name: "",
      package_description: "",
      package_price: "",
      discount: null,
      document_url: "",
    }
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    
    try {
      setUploading(true);
      
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      setFormData((prev) => ({
        ...prev,
        document_url: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Package Name
        </label>
        <input
          type="text"
          name="package_name"
          value={formData.package_name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Description
        </label>
        <textarea
          name="package_description"
          value={formData.package_description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Price
        </label>
        <input
          type="text"
          name="package_price"
          value={formData.package_price}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Discount
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Document
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
          {formData.document_url && (
            <span className="text-sm text-green-600">Document uploaded</span>
          )}
        </div>
        {formData.document_url && (
          <div className="mt-2">
            <a 
              href={formData.document_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View uploaded document
            </a>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm sm:text-base"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm sm:text-base"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
