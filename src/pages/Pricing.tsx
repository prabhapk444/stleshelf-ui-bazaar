import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

interface Pricing {
  created_at: string | null;
  discount: number | null;
  id: number;
  package_description: string;
  package_name: string;
  package_price: number;
}

const Pricing = () => {
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { data, error } = await supabase.from("pricing").select("*");

        if (error) {
          setError("Failed to fetch pricing data.");
          console.error("Error fetching pricing data:", error.message);
        } else {
          const transformedData = data?.map((item) => ({
            ...item,
            id: parseInt(item.id, 10),
            package_price: parseFloat(item.package_price),
          })) as Pricing[];

          setPricingData(transformedData || []);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
                  type="button"
                  className="w-full mt-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  Get Pacakage
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
