import { useState, forwardRef } from "react";
import { Package } from "lucide-react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const BlurImage = forwardRef<HTMLDivElement, BlurImageProps>(({ 
  src, 
  alt, 
  className, 
  width, 
  height
}, ref) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      ref={ref} 
      className="w-full h-full relative bg-gray-100 overflow-hidden"
    >
      {/* Error state */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      ) : (
        /* Just show the image - browser handles caching */
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setHasError(true)}
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  );
});

BlurImage.displayName = "BlurImage";

export default BlurImage;
