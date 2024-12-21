import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSubcategoryName: string;
  setNewSubcategoryName: (name: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categories: any[];
  onSave: () => void;
  currentSubcategory: any;
}

export const SubcategoryModal = ({
  isOpen,
  onClose,
  newSubcategoryName,
  setNewSubcategoryName,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  onSave,
  currentSubcategory,
}: SubcategoryModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {currentSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        </h2>
        <div className="space-y-4">
          <Input
            placeholder="Subcategory name"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
          />
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {currentSubcategory ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};