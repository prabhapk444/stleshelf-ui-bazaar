import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSubcategoryName: string;
  setNewSubcategoryName: (name: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categories: any[];
  onSave: () => void;
  currentSubcategory: any;
}

export const SubcategoryModal = ({
  isOpen,
  onClose,
  newSubcategoryName,
  setNewSubcategoryName,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  onSave,
  currentSubcategory,
}: SubcategoryModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Use ref for the file input

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Generate a random UUID-like string that is compatible with the backend
      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`;

      // Upload the file to the Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("subcategory-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Retrieve the public URL of the uploaded image
      const { data } = supabase.storage
        .from("subcategory-images")
        .getPublicUrl(filePath);

      const publicUrl = data?.publicUrl;
      if (!publicUrl) throw new Error("Failed to fetch public URL.");

      // Update the `subcategories` table with the image URL
      const { error: updateError } = await supabase
        .from("subcategories")
        .update({ image_url: publicUrl })
        .eq("id", currentSubcategory?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image uploaded and URL saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {currentSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        </h2>
        <div className="space-y-4">
          {/* Subcategory Name Input */}
          <Input
            placeholder="Subcategory name"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
          />

          {/* Category Select Dropdown */}
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Image Upload Section */}
          <div className="space-y-2">
            {currentSubcategory?.image_url && (
              <img
                src={currentSubcategory.image_url}
                alt={currentSubcategory.name || "Subcategory Image"}
                className="w-32 h-32 object-cover rounded"
              />
            )}

            {/* Image Input */}
            <div className="flex flex-col space-y-2">
              <input
                ref={fileInputRef} // Use ref for file input
                type="file"
                accept="image/*"
                id="image-upload"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded file:border-0 file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()} // Trigger file input with ref
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isUploading}>
              {currentSubcategory ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
