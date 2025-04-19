
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
  documentUrl: string | null;
}

// Function to generate a random 10-digit license ID
function generateLicenseId() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, packageName, amount, orderId, paymentId, documentUrl } = await req.json() as EmailRequest;
    
    // Generate a unique 10-digit license ID
    const licenseId = generateLicenseId();
    
    console.log("Sending email to:", to, "for package:", packageName);
    console.log("Document URL:", documentUrl);
    console.log("Using RESEND_API_KEY:", RESEND_API_KEY ? "Key exists" : "Key missing");

    let documentSection = '';
    if (documentUrl) {
      documentSection = `
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="color: #3B82F6;">Your Purchase Document</h3>
          <p>Access your document using the link below:</p>
          <a href="${documentUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Download Document</a>
        </div>
      `;
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Payment Successful!</h2>
        <p>Thank you for your purchase. We will contact you shortly regarding the next steps.</p>
        
        <h3 style="margin-top: 20px;">Purchase Details:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Package:</strong> ${packageName}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong> ₹${amount}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong> ${orderId}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Payment Reference:</strong> ${paymentId}</li>
        </ul>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #3B82F6; margin-top: 0;">Your License Information</h3>
          <p>Please save this license ID for future reference and support. It proves your purchase authenticity.</p>
          <div style="background-color: #eee; padding: 10px; font-family: monospace; font-size: 18px; text-align: center; letter-spacing: 2px;">
            ${licenseId}
          </div>
        </div>
        
        ${documentSection}
        
        <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>© 2024 StyleShelf. All rights reserved.</p>
        </div>
      </div>
    `;

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured in environment");
    }

    console.log("Making API request to Resend...");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Using Resend's default onboarding email which doesn't require domain verification
        to: [to],
        subject: "Payment Successful - StyleShelf",
        html: emailContent,
      }),
    });

    console.log("Resend API response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error response:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    // Return license ID along with email data
    return new Response(JSON.stringify({ ...data, licenseId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
