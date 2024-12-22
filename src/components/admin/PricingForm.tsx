import { useState } from "react";
import { Button } from "@/components/ui/button";

export const PricingForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(
    initialData || {
      package_name: "",
      package_description: "",
      package_price: "",
      discount: null,
    }
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Package Name
        </label>
        <input
          type="text"
          name="package_name"
          value={formData.package_name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Description
        </label>
        <textarea
          name="package_description"
          value={formData.package_description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Price
        </label>
        <input
          type="text"
          name="package_price"
          value={formData.package_price}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-sm sm:text-base lg:text-lg mb-1">
          Discount
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-sm sm:text-base focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm sm:text-base"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm sm:text-base"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
