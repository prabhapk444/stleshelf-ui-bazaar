import { Navbar } from "@/components/Navbar";
import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"; 

const ShopPage = () => {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from("subcategories")
          .select("*");

        if (error) {
          console.error("Error fetching subcategories:", error);
        } else {
          setSubcategories(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchSubcategories();
  }, []);

  const handleClick = (subcategoryId: number) => {
    navigate(`/products/${subcategoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <div className="pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Shop</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((subcategory) => (
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
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                    {subcategory.name}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
