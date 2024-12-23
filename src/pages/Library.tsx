import { Navbar } from "@/components/Navbar";
import Container from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Library = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['library-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <div className="pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">My Library</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  description={product.description || ''}
                  image={product.image_url || '/placeholder.svg'}
                  price={Number(product.price)}
                  category={product.category || 'Uncategorized'}
                  discount={Number(product.discount_percentage) || 0}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Library;