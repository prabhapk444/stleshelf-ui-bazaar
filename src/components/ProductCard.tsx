import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ProductModal } from "./ProductModal";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  discount?: number;
}

export const ProductCard = ({
  id,
  title,
  description,
  image,
  price,
  category,
  discount = 0,
}: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-4 right-4 bg-white/90">{category}</Badge>
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-green-500 text-white">
              {discount}% OFF
            </Badge>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-slate-600 mb-4 line-clamp-2">{description}</p>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              {discount > 0 ? (
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ₹{discountedPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">₹{price.toFixed(2)}</span>
              )}
              <Button size="sm" variant="outline">
                <Library size={18} className="mr-2" />
                My Library
              </Button>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Read More
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id,
          title,
          description,
          image,
          price,
          category,
          discount,
        }}
      />
    </>
  );
};