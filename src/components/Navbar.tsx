import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryMenu } from "./CategoryMenu";
import { categories } from "./CategoryMenu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="text-xl font-semibold">
            StyleShelf
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <CategoryMenu />
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          {/* Mobile Navigation Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b animate-fade-in">
            <div className="flex flex-col space-y-4 p-4">
              {/* Mobile Categories */}
              {categories.map((category) => (
                <div key={category.title} className="space-y-2">
                  <div className="font-medium">{category.title}</div>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <a
                        key={subcategory.title}
                        href={subcategory.href}
                        className="block text-slate-600 hover:text-slate-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subcategory.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="ghost" onClick={handleSignOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};