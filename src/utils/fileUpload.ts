import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
};