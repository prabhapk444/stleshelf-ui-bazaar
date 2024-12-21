import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => (
          <TableRow key={subcategory.id}>
            <TableCell>
              {subcategory.image_url ? (
                <img
                  src={subcategory.image_url}
                  alt={subcategory.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </TableCell>
            <TableCell>{subcategory.name}</TableCell>
            <TableCell>{subcategory.categories?.name}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};