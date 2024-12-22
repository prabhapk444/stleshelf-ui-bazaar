import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
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
    <Card className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-square relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <Package className="h-12 w-12 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-slate-900">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.categories?.name && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                {product.categories.name}
              </span>
            )}
            {product.subcategories?.name && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                {product.subcategories.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white hover:bg-slate-50"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};