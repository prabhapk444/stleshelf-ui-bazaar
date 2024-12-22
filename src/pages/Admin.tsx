import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SubcategoriesManager } from "@/components/admin/subcategories/SubcategoriesManager";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PricingManager } from "@/components/admin/PricingManager";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const hash = location.hash.replace("#", "");

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Access Denied",
            description: "Please log in to access the admin dashboard.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to verify admin access.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (profile?.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error in admin check:", error);
        toast({
          title: "Error",
          description: "An error occurred while checking admin access.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (hash) {
      case "products":
        return <ProductsManager />;
      case "categories":
        return <CategoriesManager />;
      case "subcategories":
        return <SubcategoriesManager />;
      case "pricing":
        return <PricingManager />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600">Select a section from the sidebar to manage your content.</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;