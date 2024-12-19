import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MagicBanner from "@/components/MagicBanner";
import Organizer from "@/components/Organizer";

const products = [
  {
    title: "Modern Dashboard Kit",
    description: "Complete admin dashboard with analytics, charts, and customizable components.",
    image: "/placeholder.svg",
    price: 99,
    category: "Dashboard",
  },
  {
    title: "E-commerce UI Pack",
    description: "Premium UI components specifically designed for online stores.",
    image: "/placeholder.svg",
    price: 79,
    category: "UI Kit",
  },
  {
    title: "Portfolio Templates",
    description: "Beautiful and responsive portfolio templates for creative professionals.",
    image: "/placeholder.svg",
    price: 49,
    category: "Template",
  },
  {
    title: "Landing Page Kit",
    description: "Set of customizable landing page templates for various business needs.",
    image: "/placeholder.svg",
    price: 59,
    category: "UI Kit",
  },
  {
    title: "Mobile App UI Pack",
    description: "Modern UI elements for building mobile applications with ease.",
    image: "/placeholder.svg",
    price: 89,
    category: "UI Kit",
  },
  {
    title: "Sales Funnel Builder",
    description: "A powerful tool to create and optimize sales funnels for boosting conversions.",
    image: "/placeholder.svg",
    price: 119,
    category: "Funnel",
  },
];



const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Navbar /><br /><br /><br />
      <MagicBanner/>
      
 
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 container-padding">
    
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Premium UI Components for Modern Developers
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Elevate your projects with our carefully crafted UI components and dashboard templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Button size="lg" className="w-full sm:w-auto">
              Browse Components <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
      <Organizer/>

      
      <section className="section-padding bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Developers Say</h2>
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

    </div>
  );
};

export default Index;