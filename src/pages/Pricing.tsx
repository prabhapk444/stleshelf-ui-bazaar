import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}


interface Pricing {
  created_at: string | null;
  discount: number | null;
  id: string;
  package_description: string;
  package_name: string;
  package_price: string;
}

const Pricing = () => {
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { data, error } = await supabase.from("pricing").select("*");

        if (error) {
          setError("Failed to fetch pricing data.");
          console.error("Error fetching pricing data:", error.message);
        } else {
          setPricingData(data || []);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (pricing: Pricing) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast({
          title: "Authentication Required",
          description: "Please login to make a purchase",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
   
      const response = await supabase.functions.invoke('create-order', {
        body: {
          amount: parseFloat(pricing.package_price),
          package_id: pricing.id,
          user_id: user?.id
        },
      });

      if (response.error) throw new Error(response.error.message);
      const { orderId, amount, currency } = response.data;


      const options = {
        key: "rzp_live_tkguofZ2ybrx3B",
        amount: amount,
        currency: currency,
        name: "StyleShelf",
        description: pricing.package_name,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await supabase
              .from('orders')
              .update({ 
                order_status: 'completed',
                payment_id: response.razorpay_payment_id 
              })
              .eq('payment_id', orderId);

            const emailResponse = await supabase.functions.invoke('send-payment-email', {
              body: {
                to: user?.email,
                packageName: pricing.package_name,
                amount: parseFloat(pricing.package_price),
                orderId: orderId,
                paymentId: response.razorpay_payment_id
              },
            });

            if (emailResponse.error) {
              console.error("Error sending email:", emailResponse.error);
            }

            toast({
              title: "Payment Successful",
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            
            navigate('/');
          } catch (err) {
            console.error("Error in payment handler:", err);
            toast({
              title: "Error",
              description: "There was an error processing your payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold text-center mt-12 text-gray-800">
          Our Pricing Plans
        </h2>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : pricingData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {pricingData.map((row) => (
              <div
                key={row.id}
                className="relative bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-l font-bold px-3 py-1 rounded-full">
                  {row.discount ? `${row.discount}% OFF` : "No Discount"}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {row.package_name}
                </h3>
                <p className="text-gray-600 text-medium mb-6">
                  {row.package_description}
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ₹{row.package_price}
                </p>
                <button
                  onClick={() => handlePayment(row)}
                  className="w-full mt-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  Get Package
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">
            No pricing data available.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Pricing;