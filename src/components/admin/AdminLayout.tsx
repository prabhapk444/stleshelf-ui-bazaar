import { ReactNode } from "react";
import { LayoutDashboard, Package, Folder, Tags, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash.replace("#", "");

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", hash: "" },
    { icon: Package, label: "Products", hash: "products" },
    { icon: Folder, label: "Categories", hash: "categories" },
    { icon: Tags, label: "Subcategories", hash: "subcategories" },
    { icon: CreditCard, label: "Pricing", hash: "pricing" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = hash === item.hash;
            return (
              <button
                key={item.hash}
                onClick={() => navigate(`/admin#${item.hash}`)}
                className={cn(
                  "w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors",
                  isActive && "bg-gray-50 text-custom border-r-4 border-custom"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;