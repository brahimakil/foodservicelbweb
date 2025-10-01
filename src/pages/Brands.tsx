


import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Filter, MessageCircle } from "lucide-react";
import { useBrands, useProducts, useCategories, useBannersByType } from "@/hooks/useData";
import BlurImage from "@/components/BlurImage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const BrandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const selectedBrandId = searchParams.get("brand") || "";
  
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: banners = [], isLoading: bannersLoading } = useBannersByType('hero', 'brands');
  const banner = banners[0];

  // Filter active brands
  const activeBrands = brands.filter(brand => brand.status === 'active');
  
  // Get selected brand
  const selectedBrand = activeBrands.find(b => b.id === selectedBrandId);

  // Filter products by selected brand and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.status !== 'active') return false;
      
      const matchesBrand = !selectedBrandId || product.brand === selectedBrandId;
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [products, selectedBrandId, selectedCategory, searchTerm]);

  // Get product count by brand
  const getBrandProductCount = (brandId: string) => {
    return products.filter(p => p.brand === brandId && p.status === 'active').length;
  };

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleBrandClick = (brandId: string) => {
    setSearchParams({ brand: brandId });
    setSelectedCategory("all");
    setSearchTerm("");
  };

  if (brandsLoading || productsLoading || categoriesLoading || bannersLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-64 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 lg:h-[500px] bg-gradient-to-r from-orange-100 via-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
        {banner?.image && (
          <>
            <img 
              src={banner.image} 
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
          </>
        )}
        
        <div className="text-center px-4 relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {banner?.title || 'Our Brands'}
          </h1>
          {banner?.description && (
            <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
              {banner.description}
            </p>
          )}
        </div>
      </section>
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Brands
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of premium brands and their products
            </p>
          </div>

          {selectedBrandId ? (
            /* Brand Detail View with Products */
            <div className="space-y-8">
              {/* Brand Header */}
              {selectedBrand && (
                <Card className="bg-gradient-to-r from-primary/10 to-blue-50">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {selectedBrand.logo && (
                        <img
                          src={selectedBrand.logo}
                          alt={selectedBrand.name}
                          className="w-32 h-32 object-contain bg-white rounded-lg p-4 shadow-md"
                        />
                      )}
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {selectedBrand.name}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {selectedBrand.description}
                        </p>
                        {selectedBrand.website && (
                          <a
                            href={selectedBrand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSearchParams({})}
                      >
                        View All Brands
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(c => c.status === 'active').map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                          {product.image ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="cursor-pointer">
                                  <BlurImage
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    width={400}
                                    height={400}
                                  />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden flex items-center justify-center">
                                <div className="relative w-full h-full flex items-center justify-center bg-black/5 p-8">
                                  <BlurImage
                                    src={product.image}
                                    alt={product.title}
                                    className="w-auto h-auto max-w-full max-h-[80vh] object-contain mx-auto"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                          {product.isBestSeller && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500">
                              Best Seller
                            </Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">
                              {getCategoryName(product.category)}
                            </Badge>
                            {product.price && (
                              <span className="font-bold text-primary">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* WhatsApp Contact Button */}
                          <Button
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const message = `Hi, I'm interested in *${product.title}*${product.description ? `\n\nDescription: ${product.description}` : ''}${product.price ? `\nPrice: $${product.price.toFixed(2)}` : ''}`;
                              const whatsappUrl = `https://wa.me/96181404550?text=${encodeURIComponent(message)}`;
                              window.open(whatsappUrl, '_blank');
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact on WhatsApp
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            /* Brands Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeBrands.map((brand) => {
                const productCount = getBrandProductCount(brand.id);
                return (
                  <Card
                    key={brand.id}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleBrandClick(brand.id)}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 flex items-center justify-center bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 transition-colors">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-4xl font-bold text-muted-foreground">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-center group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-3 line-clamp-2 min-h-[2.5rem]">
                        {brand.description}
                      </p>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeBrands.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Brands Available</h3>
                <p className="text-muted-foreground">
                  Check back soon for new brands
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrandsPage;