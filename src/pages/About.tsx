import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Building2, Users, Trophy, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About StyleShelf</h1>
              <p className="text-lg text-gray-600">
                StyleShelf is your premier destination for curated fashion and accessories. 
                We believe in making high-quality fashion accessible to everyone while 
                maintaining sustainable and ethical practices.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                <p className="text-gray-600">
                  We source only the finest materials and partner with renowned manufacturers.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                <p className="text-gray-600">
                  Your satisfaction is our top priority, with dedicated support available 24/7.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly evolve our collections to stay ahead of fashion trends.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to ethical practices and environmental responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, StyleShelf began with a simple mission: to make 
                high-quality fashion accessible to everyone. What started as a small 
                boutique has grown into a global platform serving fashion enthusiasts 
                worldwide.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of experienced fashion curators works tirelessly to bring you 
                the latest trends while ensuring each piece meets our strict quality 
                standards. We believe that great style shouldn't compromise on ethics 
                or sustainability.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve customers across the globe, offering a 
                carefully selected range of clothing and accessories that combine style, 
                quality, and consciousness.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;