import { Skeleton } from "@/components/ui/skeleton";
import { useBannersByType } from "@/hooks/useData";

const ProductsHero = () => {
  const { data: banners = [], isLoading } = useBannersByType('hero', 'products');
  
  // Use the first banner or fallback to default
  const banner = banners[0];

  if (isLoading) {
    return (
      <section className="relative h-80 sm:h-96 lg:h-[500px] bg-gradient-to-r from-orange-100 to-blue-100 flex items-center justify-center">
        <div className="text-center px-4">
          <Skeleton className="h-10 w-32 mx-auto mb-4" />
          <Skeleton className="h-8 w-40 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-80 sm:h-96 lg:h-[500px] bg-gradient-to-r from-orange-100 via-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
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
      
      {/* Content */}
      <div className="text-center px-4 relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 drop-shadow-lg">
          {banner?.title || "Our Products"}
        </h1>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 drop-shadow-md">
          {banner?.description || "Discover Quality Food Products"}
        </h2>
        
        {/* Breadcrumb or additional info */}
        <div className="mt-6 lg:mt-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            <span>Home</span>
            <span className="mx-2">•</span>
            <span>Products</span>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay if no banner image */}
      {!banner?.image && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default ProductsHero;