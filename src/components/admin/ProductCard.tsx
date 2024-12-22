import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductCardProps {
  product: {
    id:string,
    name: string;
    price: number;
    image_url?: string;
    categories?: { name: string };
    subcategories?: { name: string };
    description?: string;
  };
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="h-14 w-14 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Product Title and Description */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 truncate">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}
        </div>

        {/* Price and Tags */}
        <div className="space-y-2">
          <p className="text-2xl font-bold text-indigo-600">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.categories?.name && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700">
                {product.categories.name}
              </span>
            )}
            {product.subcategories?.name && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700">
                {product.subcategories.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4 mr-2" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 flex items-center justify-center"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
