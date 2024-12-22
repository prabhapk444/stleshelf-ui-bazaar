import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { PricingForm } from "./PricingForm";
import { PricingGrid } from "./PricingGrid";

export const PricingManager = () => {
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const { toast } = useToast();

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPricing(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSavePackage = async (formData: any) => {
    try {
      if (currentPackage) {
        const { error } = await supabase
          .from("pricing")
          .update(formData)
          .eq("id", currentPackage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Pricing package updated successfully",
        });
      } else {
        const { error } = await supabase.from("pricing").insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Pricing package added successfully",
        });
      }

      setModalOpen(false);
      fetchPricing();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("pricing").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing package deleted successfully",
      });

      fetchPricing();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Pricing </h2>
        <Button
          onClick={() => {
            setCurrentPackage(null);
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <PricingGrid
        pricing={pricing}
        onEdit={(pricingPackage) => {
          setCurrentPackage(pricingPackage);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            {currentPackage ? "Edit Package" : "Add Package"}
          </h2>
          <PricingForm
            initialData={currentPackage}
            onSave={handleSavePackage}
            onCancel={() => setModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
};
