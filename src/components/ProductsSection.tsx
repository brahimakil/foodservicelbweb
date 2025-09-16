import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useData";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Create a map of category IDs to names for quick lookup
  const categoryMap = categories.reduce((map, category) => {
    map[category.id] = category.name;
    map[category.name] = category.name; // Also map name to name for direct matches
    return map;
  }, {} as Record<string, string>);

  // Helper function to get category name
  const getCategoryName = (categoryIdOrName: string) => {
    return categoryMap[categoryIdOrName] || categoryIdOrName;
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory 
    ? products.filter(product => {
        const productCategoryName = getCategoryName(product.category);
        return productCategoryName === selectedCategory;
      })
    : products;

  // Prepare categories list - only show categories that have products
  const categoriesWithProducts = categories.filter(category => 
    products.some(product => getCategoryName(product.category) === category.name)
  );

  if (productsLoading || categoriesLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            Featured Products
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of premium food products
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => setSelectedCategory("")}
            className={`rounded-full px-6 py-2 transition-all ${
              selectedCategory === "" 
                ? "bg-primary hover:bg-primary/90" 
                : "hover:bg-primary/10"
            }`}
          >
            All Products
          </Button>
          {categoriesWithProducts.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full px-6 py-2 transition-all ${
                selectedCategory === category.name 
                  ? "bg-primary hover:bg-primary/90" 
                  : "hover:bg-primary/10"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                {/* Category and Best Seller Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  <Badge className="bg-primary/90 text-white text-xs font-medium px-2 py-1">
                    {getCategoryName(product.category)}
                  </Badge>
                  {product.isBestSeller && (
                    <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-1">
                      BEST SELLER
                    </Badge>
                  )}
                </div>
                
                {/* Product Image */}
                <div className="bg-gray-50 h-48 overflow-hidden cursor-pointer">
                  {product.image ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden">
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-auto max-h-[85vh] object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">No Image</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  )}

                  {product.price && (
                    <div className="text-lg font-bold text-primary">
                      ${product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `No products found in "${selectedCategory}" category.`
                : "No products available at the moment."
              }
            </p>
          </div>
        )}

        {/* View All Button */}
        {filteredProducts.length > 8 && (
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-full">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;