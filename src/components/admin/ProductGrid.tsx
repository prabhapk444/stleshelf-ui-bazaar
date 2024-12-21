import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export const ProductGrid = ({ products, onEdit, onDelete }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};