import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; 

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    discount?: number;
  };
  isLoggedIn: boolean; 
}

export const ProductModal = ({
  isOpen,
  onClose,
  product,
  isLoggedIn,
}: ProductModalProps) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleAddToLibrary = () => {
    if (!isLoggedIn) {
      toast.toast({
        title: "Authentication Required",
        description: "Please log in to add this product to your library.",
      });
      navigate("/auth");
      return;
    }
  
    toast.toast({
      title: "Added to Library",
      description: `${product.title} has been added to your library.`,
    });
  };
  

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="object-cover w-full h-full rounded-lg"
            />
            <Badge className="absolute top-4 right-4 bg-white/90">
              {product.category}
            </Badge>
            {product.discount && product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                {product.discount && product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ₹{discountedPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <Button
                className="w-full sm:w-auto"
                size="lg"
                onClick={handleAddToLibrary}
              >
                <Library className="mr-2 h-5 w-5" />
                Add to My Library
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
