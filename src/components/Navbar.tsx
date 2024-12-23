import { Menu, X, LogOut, LogIn, Home, ShoppingBag, Info, IndianRupee } from "lucide-react"; 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
          <Link to="/" className="text-xl font-semibold flex items-center">
            StyleShelf
          </Link>
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
            <Link to="/" className="hover:text-gray-600 flex items-center space-x-1">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/shop" className="hover:text-gray-600 flex items-center space-x-1">
              <ShoppingBag size={18} />
              <span>Shop</span>
            </Link>
            <Link to="/about" className="hover:text-gray-600 flex items-center space-x-1">
              <Info size={18} />
              <span>About</span>
            </Link>
            <Link to="/pricing" className="hover:text-gray-600 flex items-center space-x-1">
              <IndianRupee size={18} />
              <span>Pricing</span>
            </Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="hover:text-gray-600">Admin</Link>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            ) : profile ? (
              <Button variant="ghost" onClick={handleSignOut} className="flex items-center">
                <LogOut size={16} className="mr-2" /> Sign Out
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth")} className="flex items-center">
                <LogIn size={16} className="mr-2" /> Sign In
              </Button>
            )}
          </div>

          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b animate-fade-in">
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/" className="hover:text-gray-600 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/shop" className="hover:text-gray-600 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <ShoppingBag size={18} />
                <span>Shop</span>
              </Link>
              <Link to="/pricing" className="hover:text-gray-600 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <IndianRupee size={18} />
                <span>Pricing</span>
              </Link>
              <Link to="/about" className="hover:text-gray-600 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <Info size={18} />
                <span>About</span>
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-600">Admin</Link>
              )}
              {profile ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="hover:text-gray-600 flex items-center justify-start"
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="hover:text-gray-600 flex items-center justify-start"
                >
                  <LogIn size={16} className="mr-2" /> Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};