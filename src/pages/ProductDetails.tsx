import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Container from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  discount_percentage: number;
  category: {
    name: string;
  } | null;
}

const ProductDetails = () => {
  const { subcategoryId } = useParams();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('subcategory_id', subcategoryId);

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!subcategoryId,
  });

  const { data: subcategory } = useQuery({
    queryKey: ['subcategory', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', subcategoryId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <div className="pt-24 pb-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center">
              {subcategory?.name || 'Products'}
            </h1>
            {subcategory?.category?.name && (
              <p className="text-center text-gray-600 mt-2">
                {subcategory.category.name}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[400px] w-full" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  description={product.description || ""}
                  image={product.image_url || "/placeholder.svg"}
                  price={Number(product.price)}
                  category={product.category?.name || "Uncategorized"}
                  discount={product.discount_percentage || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;