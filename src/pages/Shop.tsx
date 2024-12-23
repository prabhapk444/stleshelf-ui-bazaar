import { Navbar } from "@/components/Navbar";
import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Subcategory {
  id: string;
  name: string;
  image_url: string | null;
  category: {
    name: string;
  } | null;
}

const ShopPage = () => {
  const navigate = useNavigate();

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          category:categories(name)
        `);
      
      if (error) throw error;
      return data as Subcategory[];
    }
  });

  const handleClick = (subcategoryId: string) => {
    navigate(`/products/${subcategoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <div className="pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Shop by Category</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategories?.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className="group rounded-lg overflow-hidden border border-slate-200 shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                  onClick={() => handleClick(subcategory.id)} 
                >
                  <div className="relative">
                    {subcategory.image_url ? (
                      <img
                        src={subcategory.image_url}
                        alt={subcategory.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                      <h3 className="text-white text-xl font-semibold">{subcategory.name}</h3>
                      {subcategory.category && (
                        <p className="text-white/80 text-sm">{subcategory.category.name}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;