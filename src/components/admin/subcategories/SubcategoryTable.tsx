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
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex flex-col items-center">
            {/* Image */}
            {subcategory.image_url ? (
              <img
                src={subcategory.image_url}
                alt={subcategory.name}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                No image
              </div>
            )}

            {/* Name and Category */}
            <h3 className="text-xl font-semibold text-center">{subcategory.name}</h3>
            <p className="text-sm text-gray-600 text-center">{subcategory.categories?.name}</p>

            {/* Actions */}
            <div className="mt-4 flex space-x-2 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(subcategory)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(subcategory.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
