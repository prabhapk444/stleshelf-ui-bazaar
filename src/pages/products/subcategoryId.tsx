import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const ProductDetails = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subcategoryId } = useParams();

  useEffect(() => {
    if (!subcategoryId) return; 

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("subcategory_id", subcategoryId); 

        if (error) {
          setError("Error fetching products.");
          console.error("Error fetching products:", error);
        } else {
          setProducts(data);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group rounded-lg overflow-hidden border border-slate-200 shadow-lg transition-all transform hover:scale-105"
              >
                <div className="relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                    {product.name}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
