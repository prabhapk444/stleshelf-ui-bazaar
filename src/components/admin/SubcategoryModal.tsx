import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSubcategoryName: string;
  setNewSubcategoryName: React.Dispatch<React.SetStateAction<string>>;
  selectedCategoryId: string;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string>>;
  categories: any[];
  onSave: () => void;
  currentSubcategory: any;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
  isOpen,
  onClose,
  newSubcategoryName,
  setNewSubcategoryName,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  onSave,
  currentSubcategory,
  file,
  setFile,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <Dialog.Panel className="fixed inset-0 m-auto max-w-xl sm:max-w-lg bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full z-50">
        <Dialog.Title className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          {currentSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        </Dialog.Title>

        <div className="space-y-6">
          <div>
            <label htmlFor="subcategory-name" className="block text-sm sm:text-base font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              id="subcategory-name"
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="Enter subcategory name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm sm:text-base font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

      
          <div>
            <label htmlFor="file" className="block text-sm sm:text-base font-medium text-gray-700">
              Upload File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button onClick={onClose} variant="outline" className="px-6 py-2 text-gray-600 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!newSubcategoryName || !selectedCategoryId || !file}
            className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            Save
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
