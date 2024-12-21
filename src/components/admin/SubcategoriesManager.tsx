import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

export const SubcategoriesManager = () => {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
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
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;

    try {
      if (currentSubcategory) {
        const { error } = await supabase
          .from("subcategories")
          .update({
            name: newSubcategoryName.trim(),
            category_id: selectedCategoryId,
          })
          .eq("id", currentSubcategory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subcategory updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("subcategories")
          .insert([{
            name: newSubcategoryName.trim(),
            category_id: selectedCategoryId,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subcategory added successfully",
        });
      }

      setNewSubcategoryName("");
      setSelectedCategoryId("");
      setCurrentSubcategory(null);
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
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
          <Plus className="mr-2 h-4 w-4" /> Add Subcategory
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>{subcategory.name}</TableCell>
              <TableCell>{subcategory.categories?.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setNewSubcategoryName(subcategory.name);
                      setSelectedCategoryId(subcategory.category_id);
                      setCurrentSubcategory(subcategory);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(subcategory.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSubcategory}>
                {currentSubcategory ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};