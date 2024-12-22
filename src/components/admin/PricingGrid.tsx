import { Button } from "../ui/button";

export const PricingGrid = ({ pricing, onEdit, onDelete }: any) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricing.map((item: any) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{item.package_name}</h3>
            <p>{item.package_description}</p>
            <p className="font-medium">Price: ₹{item.package_price}</p>
            {item.discount && <p className="text-green-500">Discount: {item.discount}%</p>}
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => onEdit(item)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(item.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  