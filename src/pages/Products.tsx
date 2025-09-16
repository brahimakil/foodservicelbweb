import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsHero from "@/components/ProductsHero";
import ProductGrid from "@/components/ProductGrid";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductsHero />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Products;