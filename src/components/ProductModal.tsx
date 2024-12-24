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
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
}

export const ProductModal = ({
  isOpen,
  onClose,
  product,
}: ProductModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session) {
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('product_id', product.id)
          .single();
        
        setIsInLibrary(!!cartItems);
      }
    };
    
    checkAuth();
  }, [product.id]);

  const handleAddToLibrary = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add this product to your library.",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: session.user.id,
            product_id: product.id,
          }
        ]);

      if (error) throw error;

      setIsInLibrary(true);
      toast({
        title: "Added to Library",
        description: `${product.title} has been added to your library.`,
      });
    } catch (error) {
      console.error('Error adding to library:', error);
      toast({
        title: "Error",
        description: "Failed to add to library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromLibrary = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', product.id);

      if (error) throw error;

      setIsInLibrary(false);
      toast({
        title: "Removed from Library",
        description: `${product.title} has been removed from your library.`,
      });
    } catch (error) {
      console.error('Error removing from library:', error);
      toast({
        title: "Error",
        description: "Failed to remove from library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                onClick={isInLibrary ? handleRemoveFromLibrary : handleAddToLibrary}
                disabled={isLoading}
              >
                <Library className="mr-2 h-5 w-5" />
                {isInLibrary ? "Remove from Library" : "Add to My Library"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};