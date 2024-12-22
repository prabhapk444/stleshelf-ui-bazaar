import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadProductImage } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  categories: any[];
  subcategories: any[];
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({
  categories,
  subcategories,
  initialData,
  onSave,
  onCancel,
}: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image_url: initialData?.image_url || "",
    category_id: initialData?.category_id || "",
    subcategory_id: initialData?.subcategory_id || "",
    discount_percentage: initialData?.discount_percentage?.toString() || "", 
    coupon_code: initialData?.coupon_code || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
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

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price),
        discount_percentage: formData.discount_percentage
          ? parseFloat(formData.discount_percentage)
          : null,
      };

      await onSave(dataToSave);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => !formData.category_id || sub.category_id === formData.category_id
  );

  return (
    <div className="space-y-4">
      <Input
        name="name"
        placeholder="Product name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <Textarea
        name="description"
        placeholder="Product description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <Input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        value={formData.price}
        onChange={handleInputChange}
      />
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Product preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}
      </div>
      <Select
        value={formData.category_id}
        onValueChange={(value) => {
          handleSelectChange("category_id", value);
          handleSelectChange("subcategory_id", ""); 
        }}
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
      <Select
        value={formData.subcategory_id}
        onValueChange={(value) => handleSelectChange("subcategory_id", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a subcategory" />
        </SelectTrigger>
        <SelectContent>
          {filteredSubcategories.map((subcategory) => (
            <SelectItem key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        name="discount_percentage"
        type="number"
        step="0.01"
        placeholder="Discount percentage (optional)"
        value={formData.discount_percentage}
        onChange={handleInputChange}
      />
      <Input
        name="coupon_code"
        placeholder="Coupon code (optional)"
        value={formData.coupon_code}
        onChange={handleInputChange}
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          {initialData ? "Update" : "Add"}
        </Button>
      </div>
    </div>
  );
};
