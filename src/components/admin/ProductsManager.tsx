import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export const ProductsManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    subcategory_id: "",
    discount_percentage: "",
    coupon_code: "",
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(name), subcategories(name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true }),
        supabase
          .from("subcategories")
          .select("*")
          .order("name", { ascending: true }),
      ]);

      if (productsResponse.error) throw productsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;
      if (subcategoriesResponse.error) throw subcategoriesResponse.error;

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setSubcategories(subcategoriesResponse.data || []);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      subcategory_id: "",
      discount_percentage: "",
      coupon_code: "",
    });
    setCurrentProduct(null);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        coupon_code: formData.coupon_code || null,
      };

      if (currentProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", currentProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      setModalOpen(false);
      resetForm();
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
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
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

  const filteredSubcategories = subcategories.filter(
    (sub) => !formData.category_id || sub.category_id === formData.category_id
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Subcategory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.categories?.name}</TableCell>
              <TableCell>{product.subcategories?.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setFormData({
                        name: product.name,
                        description: product.description || "",
                        price: product.price.toString(),
                        image_url: product.image_url || "",
                        category_id: product.category_id || "",
                        subcategory_id: product.subcategory_id || "",
                        discount_percentage: product.discount_percentage?.toString() || "",
                        coupon_code: product.coupon_code || "",
                      });
                      setCurrentProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
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
            {currentProduct ? "Edit Product" : "Add Product"}
          </h2>
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
            <Input
              name="image_url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={handleInputChange}
            />
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
              placeholder="Discount percentage"
              value={formData.discount_percentage}
              onChange={handleInputChange}
            />
            <Input
              name="coupon_code"
              placeholder="Coupon code"
              value={formData.coupon_code}
              onChange={handleInputChange}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                {currentProduct ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};