import { Button } from "@/components/ui/button";
import { useBannersByType } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star, Award } from "lucide-react";

const Hero = () => {
  const { data: heroBanners = [], isLoading } = useBannersByType('hero', 'home');
  
  // Use the first hero banner or fallback to default content
  const heroBanner = heroBanners[0];

  if (isLoading) {
    return (
      <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-64" />
              <Skeleton className="h-12 w-40" />
            </div>
            <div className="relative">
              <Skeleton className="h-96 lg:h-[450px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Premium Quality Food Products
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary block">
                {heroBanner?.title || "Quality Ingredients,"}
              </span>
              <span className="text-primary block mt-2">
                {heroBanner?.description || "Served with Care."}
              </span>
            </h1>
            
            {/* Value Proposition */}
            <div className="bg-secondary/10 rounded-2xl p-6 lg:p-8 inline-block border border-secondary/20">
              <p className="text-secondary font-bold text-lg lg:text-xl leading-relaxed">
                OFFERING
                EXCELLENT 
                FOOD VALUE
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">Global Brands</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">Best Service</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Explore Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {heroBanner?.link && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open(heroBanner.link, '_blank')}
                  className="text-lg px-8 py-4 rounded-full border-2 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Learn More
                </Button>
              )}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 lg:p-8 h-96 lg:h-[450px] overflow-hidden">
              {heroBanner?.image ? (
                <img 
                  src={heroBanner.image} 
                  alt={heroBanner.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-primary" />
                    </div>
                    <span className="text-lg text-primary font-medium">Premium Food Products</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-8 w-8 h-8 bg-primary/40 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;