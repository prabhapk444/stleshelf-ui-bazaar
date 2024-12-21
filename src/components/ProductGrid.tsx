import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `);
  
  if (error) throw error;
  return data;
};

export const ProductGrid = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  return (
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
  );
};