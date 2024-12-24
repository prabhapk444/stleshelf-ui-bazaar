import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID')!,
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET')!,
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, package_id, user_id } = await req.json();

    console.log('Creating order with:', { amount, package_id, user_id });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
      currency: 'INR',
    });

    console.log('Razorpay order created:', order);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Store order in database
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([
        {
          user_id,
          package_id,
          amount,
          payment_id: order.id,
          order_status: 'created'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Order stored in database:', data);

    return new Response(
      JSON.stringify({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        dbOrder: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});