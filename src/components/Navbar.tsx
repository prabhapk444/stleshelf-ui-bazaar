import { ShoppingCart, Menu, X, LogOut, User, Search } from "lucide-react"; 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", session.user.id)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-semibold">
              StyleShelf
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-gray-600">Home</Link>
              <Link to="/about" className="hover:text-gray-600">About</Link>
              <Link to="/categories" className="hover:text-gray-600">Products</Link>
              <Link to="/services" className="hover:text-gray-600">Services</Link>
              <Link to="/contact" className="hover:text-gray-600">Contact</Link>
            </div>
          </div>
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center border rounded-full px-4 py-1 bg-gray-100 focus-within:bg-white focus-within:shadow-md transition"
          >
            <Search size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-48 md:w-64"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          <div className="hidden md:flex items-center space-x-6">
            {profile?.role === "admin" && (
              <Link to="/admin" className="hover:text-gray-600">Admin</Link>
            )}
            <Link to="/cart" className="relative flex items-center hover:text-gray-600">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                3 
              </span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <span>{profile?.name || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut size={16} className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b animate-fade-in">
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link to="/categories" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Categories
              </Link>
              <Link to="/contact" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <form
                onSubmit={handleSearch}
                className="flex items-center border rounded-full px-4 py-1 bg-gray-100 focus-within:bg-white focus-within:shadow-md transition"
              >
                <Search size={20} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full"
                />
              </form>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="hover:text-gray-600 flex items-center"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
