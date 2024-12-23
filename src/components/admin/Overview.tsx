import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, Tags, Folder, IndianRupee } from "lucide-react"; 
import { Skeleton } from "@/components/ui/skeleton";

type TableName = "products" | "categories" | "subcategories" | "cart_items" | "profiles" | "pricing";

const Overview = () => {
  const fetchTableCount = async (tableName: TableName) => {
    const { count } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });
    return count || 0;
  };

  const { data: productsCount = 0, isLoading: loadingProducts } = useQuery({
    queryKey: ["products-count"],
    queryFn: () => fetchTableCount("products"),
  });

  const { data: categoriesCount = 0, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories-count"],
    queryFn: () => fetchTableCount("categories"),
  });

  const { data: subcategoriesCount = 0, isLoading: loadingSubcategories } = useQuery({
    queryKey: ["subcategories-count"],
    queryFn: () => fetchTableCount("subcategories"),
  });

  const { data: cartItemsCount = 0, isLoading: loadingCartItems } = useQuery({
    queryKey: ["cart-items-count"],
    queryFn: () => fetchTableCount("cart_items"),
  });

  const { data: profilesCount = 0, isLoading: loadingProfiles } = useQuery({
    queryKey: ["profiles-count"],
    queryFn: () => fetchTableCount("profiles"),
  });

  const { data: pricingCount = 0, isLoading: loadingPricing } = useQuery({
    queryKey: ["pricing-count"],
    queryFn: () => fetchTableCount("pricing"),
  });

  const stats = [
    {
      title: "Total Products",
      value: productsCount,
      icon: Package,
      loading: loadingProducts,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: profilesCount,
      icon: Users,
      loading: loadingProfiles,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cart Items",
      value: cartItemsCount,
      icon: ShoppingCart,
      loading: loadingCartItems,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Categories",
      value: categoriesCount,
      icon: Folder,
      loading: loadingCategories,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Subcategories",
      value: subcategoriesCount,
      icon: Tags,
      loading: loadingSubcategories,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Pricing Plans",
      value: pricingCount,
      icon: IndianRupee, 
      loading: loadingPricing,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-full`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;
