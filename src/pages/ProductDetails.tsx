import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <Container>
          <div className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <Container>
          <div className="pt-24">
            <h1 className="text-2xl">Product not found</h1>
          </div>
        </Container>
      </div>
    );
  }

  const discountedPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div>
      <Navbar />
      <Container>
        <div className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            {product.discount_percentage ? (
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </p>
                <p className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-green-600">
                  Save {product.discount_percentage}%
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            )}
            <p className="text-gray-600">{product.description}</p>
            <div className="space-y-4">
              <Button size="lg" className="w-full md:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;