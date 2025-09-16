import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useBestSellers, useBannersByType } from "@/hooks/useData";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const BestSellers = () => {
  const { data: bestSellers = [], isLoading: bestSellersLoading } = useBestSellers();
  const { data: promotionBanners = [], isLoading: bannersLoading } = useBannersByType('promotion', 'home');
  
  // Use the first promotion banner for the showcase area
  const showcaseBanner = promotionBanners[0];

  if (bestSellersLoading || bannersLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50/50 via-green-50/50 to-blue-50/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <Skeleton className="h-48 w-full rounded-2xl mb-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50/50 via-green-50/50 to-blue-50/50 relative overflow-hidden">
      {/* Background decorations - matching the theme */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Top Selling Products
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Best Seller Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover our most popular items loved by customers worldwide
          </p>

          {/* Featured Banner/Promotion */}
          {showcaseBanner && (
            <div className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-12 overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">{showcaseBanner.title}</h3>
                {showcaseBanner.description && (
                  <p className="text-lg opacity-90 mb-4">{showcaseBanner.description}</p>
                )}
                {showcaseBanner.link && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => window.open(showcaseBanner.link, '_blank')}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Learn More
                  </Button>
                )}
              </div>
              
              {/* Banner Background Image */}
              {showcaseBanner.image && (
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={showcaseBanner.image} 
                    alt={showcaseBanner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
          )}
        </div>

        {/* Best Sellers Grid */}
        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {bestSellers.slice(0, 3).map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                {/* Best Seller Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-1">
                    BEST SELLER
                  </Badge>
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
              <Award className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Best Sellers Yet</h3>
            <p className="text-muted-foreground">
              Our best selling products will appear here once we have sales data.
            </p>
          </div>
        )}

        {/* Call to Action */}
        {bestSellers.length > 0 && (
          <div className="text-center mt-16">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                View All Products
                <Eye className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;