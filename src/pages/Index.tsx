import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import ProductsSection from "@/components/ProductsSection";
import BrandsSection from "@/components/BrandsSection";
import BestSellers from "@/components/BestSellers";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturesSection />
      <ProductsSection />
      <BrandsSection />
      <BestSellers />
      <Footer />
    </div>
  );
};

export default Index;
