import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useData";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL PRODUCTS");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
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

  // Filter and search products
  let filteredProducts = selectedCategory === "ALL PRODUCTS" 
    ? products 
    : products.filter(product => {
        const productCategoryName = getCategoryName(product.category);
        return productCategoryName === selectedCategory;
      });

  // Apply search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => {
      const categoryName = getCategoryName(product.category);
      return product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.title.localeCompare(b.title);
        break;
      case "price":
        comparison = (a.price || 0) - (b.price || 0);
        break;
      case "newest":
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Prepare categories list - only show categories that have products
  const categoriesWithProducts = categories.filter(category => 
    products.some(product => getCategoryName(product.category) === category.name)
  );
  const categoryList = ["ALL PRODUCTS", ...categoriesWithProducts.map(cat => cat.name)];

  if (productsLoading || categoriesLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Filters Skeleton */}
          <div className="flex flex-wrap gap-3 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          {/* Search and Controls Skeleton */}
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">All Products</h2>
            <p className="text-muted-foreground mt-2">
              Browse our complete collection of premium food products
            </p>
          </div>
          <Badge variant="outline" className="text-primary border-primary px-4 py-2">
            {filteredProducts.length} Products Found
          </Badge>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categoryList.map((category) => {
            const productCount = category === "ALL PRODUCTS" 
              ? products.length 
              : products.filter(p => getCategoryName(p.category) === category).length;
            
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition-all ${
                  selectedCategory === category 
                    ? "bg-primary hover:bg-primary/90" 
                    : "hover:bg-primary/10"
                }`}
              >
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {productCount}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "name" ? "price" : sortBy === "price" ? "newest" : "name")}
              className="h-12 px-4"
            >
              <Filter className="w-4 h-4 mr-2" />
              Sort: {sortBy === "name" ? "Name" : sortBy === "price" ? "Price" : "Newest"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-12 px-3"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-12 px-3"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Product Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-48 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Eye className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <div className="flex gap-2">
                            <Badge className="bg-primary/90 text-white text-xs font-medium px-2 py-1">
                              {getCategoryName(product.category)}
                            </Badge>
                            {product.isBestSeller && (
                              <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-1">
                                BEST SELLER
                              </Badge>
                            )}
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-gray-600 mb-2">{product.description}</p>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        {product.price && (
                          <div className="text-xl font-bold text-primary">
                            ${product.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No products match "${searchTerm}" in the selected category.`
                : "No products available in this category."
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL PRODUCTS");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;