import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { SubcategoryModal } from "../SubcategoryModal";
import { SubcategoryTable } from "./SubcategoryTable";

export const SubcategoriesManager = () => {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [subcategoriesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from("subcategories")
          .select("*, categories(name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true }),
      ]);

      if (subcategoriesResponse.error) throw subcategoriesResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setSubcategories(subcategoriesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;

      if (file) {
        // Upload the file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("subcategory-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from("subcategory-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const subcategoryData = {
        name: newSubcategoryName.trim(),
        category_id: selectedCategoryId,
        image_url: imageUrl,
      };

      if (currentSubcategory) {
        const { error } = await supabase
          .from("subcategories")
          .update(subcategoryData)
          .eq("id", currentSubcategory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subcategory updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("subcategories")
          .insert([subcategoryData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subcategory added successfully",
        });
      }

      setNewSubcategoryName("");
      setSelectedCategoryId("");
      setCurrentSubcategory(null);
      setFile(null);
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (subcategory: any) => {
    setNewSubcategoryName(subcategory.name);
    setSelectedCategoryId(subcategory.category_id);
    setCurrentSubcategory(subcategory);
    setModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Subcategories</h2>
        <Button
          onClick={() => {
            setNewSubcategoryName("");
            setSelectedCategoryId("");
            setCurrentSubcategory(null);
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <SubcategoryTable
        subcategories={subcategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        newSubcategoryName={newSubcategoryName}
        setNewSubcategoryName={setNewSubcategoryName}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        categories={categories}
        onSave={handleSaveSubcategory}
        currentSubcategory={currentSubcategory}
        file={file}
        setFile={setFile}
      />
    </div>
  );
};