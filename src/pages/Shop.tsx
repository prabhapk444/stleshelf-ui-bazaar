import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";
import Container from "@/components/Container";

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <div className="pt-24 pb-16">
          <h1 className="text-4xl font-bold mb-8">Shop</h1>
          <ProductGrid />
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;