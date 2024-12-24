import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface LibraryItem {
  id: string;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: { name: string };
    discount_percentage: number;
  };
}

const Library = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetchItems = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your library.",
        });
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            products (
              id,
              name,
              description,
              price,
              image_url,
              discount_percentage,
              category:categories(name)
            )
          `)
          .eq('user_id', session.user.id);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching library items:', error);
        toast({
          title: "Error",
          description: "Failed to load your library items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchItems();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8">My Library</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Your library is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                id={item.products.id}
                title={item.products.name}
                description={item.products.description || ""}
                image={item.products.image_url || "/placeholder.svg"}
                price={Number(item.products.price)}
                category={item.products.category?.name || "Uncategorized"}
                discount={Number(item.products.discount_percentage)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;