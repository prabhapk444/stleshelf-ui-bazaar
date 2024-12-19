import { useState, useEffect } from "react";
import { Menu, X, Home, ShoppingCart, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryMenu } from "./CategoryMenu";
import { categories } from "./CategoryMenu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string | null; role: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-semibold">
              StyleShelf
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-1 hover:text-gray-600">
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link to="/about" className="hover:text-gray-600">About</Link>
              <CategoryMenu />
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {profile?.role === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 hover:text-gray-600">
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            )}
            <Link to="/cart" className="hover:text-gray-600">
              <ShoppingCart size={24} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User size={20} />
                  <span>{profile?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
{isOpen && (
  <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b animate-fade-in">
    <div className="flex flex-col space-y-4 p-4">
      {/* Home Link */}
      <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      {/* About Link */}
      <Link to="/about" className="flex items-center space-x-2 hover:text-gray-600" onClick={() => setIsOpen(false)}>
        <span>About</span>
      </Link>
      {/* Categories */}
      <div className="space-y-2">
        <div className="font-medium">Categories</div>
        <div className="pl-4 space-y-2">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.href || '#'}
              className="block text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>
      {/* User Icon & Logout */}
      <div className="flex items-center space-x-4">
        <User size={20} />
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center space-x-2"
        >
          <span>Logout</span>
        </Button>
      </div>
      {/* Cart Icon */}
      <Link to="/cart" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
        <ShoppingCart size={20} />
        <span>Cart</span>
      </Link>
    </div>
  </div>
)}

      </div>
    </nav>
  );
};