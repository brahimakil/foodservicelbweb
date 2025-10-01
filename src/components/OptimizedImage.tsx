import { useState, useEffect, useRef, forwardRef } from "react";
import { Package } from "lucide-react";
import { ImagePresets } from "@/lib/imageOptimizer";
import { imagePreloader } from "@/lib/imagePreloader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  preset?: 'thumbnail' | 'card' | 'full' | 'logo' | 'banner';
}

export const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(({ 
  src, 
  alt, 
  className, 
  width, 
  height,
  preset = 'card' 
}, ref) => {
  const optimizedSrc = src ? ImagePresets[preset](src) : src;
  
  // Check if the ORIGINAL src is preloaded (not the optimized version)
  const isPreloaded = imagePreloader.isLoaded(src);
  
  const [isLoaded, setIsLoaded] = useState(isPreloaded);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // If preloaded, show immediately
  useEffect(() => {
    if (isPreloaded) {
      setIsLoaded(true);
    }
  }, [isPreloaded]);

  return (
    <div ref={ref || imgRef} className="w-full h-full relative bg-gray-100">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-300" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="eager"
        decoding="async"
      />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
