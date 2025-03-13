
import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (file: File, bucket = 'product-images') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

// Helper function specifically for pricing documents
export const uploadPricingDocument = async (file: File) => {
  return uploadProductImage(file, 'pricing-documents');
};
