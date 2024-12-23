import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MagicBanner from "@/components/MagicBanner";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import AllServices from "./Services";
import { useState } from "react"; 

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .limit(6);
  
  if (error) throw error;
  return data as Product[];
};

const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  return data as Category[];
};

const productAnimation = {
  hidden: { opacity: 0, x: -100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.8 },
  }),
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });



  const filteredProducts = selectedCategory
    ? products.filter(product => product.category?.name === selectedCategory)
    : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="pt-16">
          <MagicBanner />
        </div>
        
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative z-10 bg-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Premium UI Components for Modern Developers
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Elevate your projects with our carefully crafted UI components and dashboard templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Button size="lg" className="w-full sm:w-auto" onClick={()=> navigate("/shop")}>
                Browse Components <ArrowRight className="ml-2" size={20}/>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={()=> navigate("/library")}>
                View Library
              </Button>
            </div>
          </div>
        </section>
        <section className="section-padding bg-slate-50 relative z-10">
          <div className="container mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-center mb-6">Featured Products</h2>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="mb-2"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    className="mb-2"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-96 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={productAnimation}
                  >
                    <ProductCard
                      id={product.id}
                      title={product.name}
                      description={product.description || ""}
                      image={product.image_url || "/placeholder.svg"}
                      price={Number(product.price)}
                      category={product.category?.name || "Uncategorized"}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
        <AllServices/>

        <section className="section-padding relative z-10 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 glass-card">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="fill-yellow-400 text-yellow-400" size={20} />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4">
                    "The quality and attention to detail in these components is outstanding. Saved me weeks of development time!"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-slate-500">Senior Developer</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;