import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface SubcategoryTableProps {
  subcategories: any[];
  onEdit: (subcategory: any) => void;
  onDelete: (id: string) => void;
}

export const SubcategoryTable = ({
  subcategories,
  onEdit,
  onDelete,
}: SubcategoryTableProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex flex-col items-center">
            {subcategory.image_url ? (
              <div className="w-full h-40 mb-4 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={subcategory.image_url}
                  alt={subcategory.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-40 mb-4 bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <h3 className="text-lg font-semibold text-center text-gray-900">
              {subcategory.name}
            </h3>
            {subcategory.categories?.name && (
              <p className="text-sm text-center text-gray-600">
                {subcategory.categories.name}
              </p>
            )}

            <div className="mt-4 flex space-x-2 justify-center">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-gray-100"
                onClick={() => onEdit(subcategory)}
              >
                <Pencil className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="hover:bg-red-50"
                onClick={() => onDelete(subcategory.id)}
              >
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
