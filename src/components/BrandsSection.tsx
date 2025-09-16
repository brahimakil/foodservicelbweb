import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/useData";

const BrandsSection = () => {
  const { data: brands = [], isLoading } = useBrands();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPositionRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Auto-scroll functionality with smooth continuation
  useEffect(() => {
    if (!scrollRef.current || brands.length === 0) return;

    const scrollContainer = scrollRef.current;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = (currentTime: number) => {
      if (!isPaused && scrollRef.current) {
        const deltaTime = currentTime - lastTimeRef.current;
        
        // Only update if enough time has passed (for consistent speed)
        if (deltaTime >= 16) { // ~60fps
          scrollPositionRef.current += scrollSpeed;
          
          const scrollWidth = scrollContainer.scrollWidth;
          const clientWidth = scrollContainer.clientWidth;
          const maxScroll = scrollWidth - clientWidth;
          
          // Reset position when we've scrolled through all content
          if (scrollPositionRef.current >= maxScroll) {
            scrollPositionRef.current = 0;
          }
          
          scrollContainer.scrollLeft = scrollPositionRef.current;
          lastTimeRef.current = currentTime;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize with current scroll position to maintain continuity
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollLeft;
    }
    
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [brands, isPaused]);

  // Handle pause/resume without breaking animation
  const handleMouseEnter = () => {
    // Save current position before pausing
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollLeft;
    }
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    // Resume from current position
    setIsPaused(false);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50/50 via-green-50/50 to-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="flex gap-8 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <Skeleton className="w-32 h-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Create duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50/50 via-green-50/50 to-blue-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Trusted Partners
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Brand Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Working with the world's leading food and beverage brands
          </p>
        </div>

        {brands.length > 0 ? (
          <div className="relative">
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable container */}
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-hidden py-8 scroll-smooth"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div 
                  key={`${brand.id}-${index}`}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-40 h-24 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 group-hover:scale-105 border border-gray-100">
                    {brand.logo ? (
                      <img 
                        src={brand.logo}  // Changed from brand.image to brand.logo
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-primary">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-primary">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Brand name below - visible on hover */}
                  <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-sm font-semibold text-primary">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Manual scroll indicators */}
            <div className="flex justify-center mt-8 gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPaused ? 'bg-yellow-500' : 'bg-primary animate-pulse'
                }`}></div>
                <span>{isPaused ? 'Paused' : 'Auto-scrolling'}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Hover to pause</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">B</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Brand Partners Yet
            </h3>
            <p className="text-muted-foreground">
              We're building partnerships with amazing brands to serve you better.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsSection;