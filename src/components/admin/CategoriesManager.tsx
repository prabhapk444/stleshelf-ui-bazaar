import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal"; 
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

export const CategoriesManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<any>(null); 
  const [newCategory, setNewCategory] = useState(""); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
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
    fetchCategories();
  }, []);

  const handleSaveCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      if (currentCategory) {
        const { error } = await supabase
          .from("categories")
          .update({ name: newCategory.trim() })
          .eq("id", currentCategory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([{ name: newCategory.trim() }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category added successfully",
        });
      }

      setNewCategory("");
      setCurrentCategory(null);
      setModalOpen(false);
      fetchCategories();
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
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      fetchCategories();
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
        <h2 className="text-2xl font-semibold">Categories</h2>
        <Button
          onClick={() => {
            setNewCategory("");
            setCurrentCategory(null);
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add 
        </Button>
      </div>
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>S.No</TableHead> 
      <TableHead>Name</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {categories.map((category, index) => (
      <TableRow key={category.id}>
        <TableCell>{index + 1}</TableCell> 
        <TableCell>{category.name}</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setNewCategory(category.name);
                setCurrentCategory(category);
                setModalOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(category.id)}
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
      {currentCategory ? "Edit Category" : "Add Category"}
    </h2>
    <Input
      placeholder="Category name"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
    />
    <div className="flex justify-end space-x-2 mt-4">
      <Button variant="outline" onClick={() => setModalOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSaveCategory}>
        {currentCategory ? "Update" : "Add"}
      </Button>
    </div>
  </div>
</Modal>

    
    </div>
  );
};
