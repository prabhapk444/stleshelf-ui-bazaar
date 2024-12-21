import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('subcategory-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('subcategory-images')
        .getPublicUrl(filePath);

      // Update the subcategory with the new image URL
      const { error: updateError } = await supabase
        .from('subcategories')
        .update({ image_url: publicUrl })
        .eq('id', currentSubcategory.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
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
          <Input
            placeholder="Subcategory name"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
          />
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

          {currentSubcategory && (
            <div className="space-y-2">
              {currentSubcategory.image_url && (
                <img
                  src={currentSubcategory.image_url}
                  alt={currentSubcategory.name}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center"
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ImagePlus className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </label>
              </div>
            </div>
          )}

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