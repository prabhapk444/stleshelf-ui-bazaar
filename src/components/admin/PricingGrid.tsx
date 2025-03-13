
import { Button } from "../ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";

export const PricingGrid = ({ pricing, onEdit, onDelete }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pricing.map((item: any) => (
        <div key={item.id} className="p-4 border rounded-lg shadow-md hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-900">{item.package_name}</h3>
          <p className="text-sm text-gray-600">{item.package_description}</p>
          <p className="font-medium text-lg text-gray-900">₹{item.package_price}</p>
          {item.discount && (
            <p className="text-green-500">Discount: {item.discount}%</p>
          )}
          {item.document_url && (
            <a 
              href={item.document_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline mt-2 text-sm"
            >
              <FileText className="h-4 w-4 mr-1" /> View Document
            </a>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => onEdit(item)}
              variant="outline"
              className="flex items-center justify-center space-x-1 text-blue-600 hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(item.id)}
              className="flex items-center justify-center space-x-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
