import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  packageName: string;
  amount: number;
  orderId: string;
  paymentId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, packageName, amount, orderId, paymentId } = await req.json() as EmailRequest;
    console.log("Sending email to:", to, "for package:", packageName);

    const emailContent = `
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase. We will contact you shortly regarding the next steps.</p>
      <h3>Purchase Details:</h3>
      <ul>
        <li>Package: ${packageName}</li>
        <li>Amount: ₹${amount}</li>
        <li>Order ID: ${orderId}</li>
        <li>Payment Reference: ${paymentId}</li>
      </ul>
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "StyleShelf <onboarding@resend.dev>",
        to: [to],
        subject: "Payment Successful - StyleShelf",
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});