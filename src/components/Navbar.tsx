import { ShoppingCart, Menu, X, LogOut, LogIn } from "lucide-react"; 
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("name, role")
            .eq("id", session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex-1 flex items-center space-x-8">
            <Link to="/" className="text-xl font-semibold">
              StyleShelf
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-gray-600">Home</Link>
              <Link to="/shop" className="hover:text-gray-600">Shop</Link>
              <Link to="/about" className="hover:text-gray-600">About</Link>
              <Link to="/services" className="hover:text-gray-600">Services</Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-600">Admin</Link>
              )}
            </div>
          </div>

          {/* Desktop Cart and Auth */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative flex items-center hover:text-gray-600">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                0
              </span>
            </Link>
            
            {isLoading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            ) : profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <span>{profile.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profile.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth")} className="flex items-center">
                <LogIn size={16} className="mr-2" /> Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button - Now on the right */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b animate-fade-in">
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
              <Link to="/about" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link to="/services" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                Services
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <Link to="/cart" className="hover:text-gray-600 flex items-center" onClick={() => setIsOpen(false)}>
                <ShoppingCart size={20} className="mr-2" />
                Cart
              </Link>
              {profile ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="hover:text-gray-600 flex items-center justify-start"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="hover:text-gray-600 flex items-center justify-start"
                >
                  <LogIn size={16} className="mr-2" /> Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};