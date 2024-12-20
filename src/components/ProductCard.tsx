import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          <Button className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};