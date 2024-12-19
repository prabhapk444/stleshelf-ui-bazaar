import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export const ProductCard = ({
  title,
  description,
  image,
  price,
  category,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover-card glass-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 bg-white/90">{category}</Badge>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">${price}</span>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};