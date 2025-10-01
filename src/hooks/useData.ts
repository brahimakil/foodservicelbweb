import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  productService, 
  categoryService, 
  brandService, 
  bannerService,
  contactMessageService,
  pdfCatalogService,
  getBannersByType, 
  getBestSellers,
  getActivePDFCatalog
} from '@/services/firebase';
import { ContactMessage, Product, Category, Brand } from '@/types'; // Add missing imports
import { imagePreloader } from '@/lib/imagePreloader';

const CACHE_KEYS = {
  PRODUCTS: 'cached_products',
  CATEGORIES: 'cached_categories',
  BRANDS: 'cached_brands',
};

const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) {
      console.log(`❌ No cache found for ${key}`);
      return null;
    }
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Math.round((Date.now() - timestamp) / 1000); // seconds
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (isExpired) {
      console.log(`⏰ Cache expired for ${key} (${age}s old)`);
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`📦 Using cached data for ${key}:`, {
      itemCount: Array.isArray(data) ? data.length : 'N/A',
      age: `${age}s ago`,
      size: `${(cached.length / 1024).toFixed(2)}KB`
    });
    return data;
  } catch (error) {
    console.error(`💥 Error reading cache for ${key}:`, error);
    return null;
  }
};

const setCachedData = <T>(key: string, data: T): void => {
  try {
    const stringified = JSON.stringify({
      data,
      timestamp: Date.now()
    });
    localStorage.setItem(key, stringified);
    console.log(`💾 Cached data for ${key}:`, {
      itemCount: Array.isArray(data) ? data.length : 'N/A',
      size: `${(stringified.length / 1024).toFixed(2)}KB`
    });
  } catch (error) {
    console.error(`💥 Failed to cache data for ${key}:`, error);
  }
};

// Add image preloading helper
const preloadImages = (products: Product[]) => {
  products.forEach(product => {
    if (product.image) {
      const img = new Image();
      img.src = product.image;
    }
  });
  console.log(`🖼️ Preloading ${products.filter(p => p.image).length} product images`);
};

// Products
export const useProducts = () => {
  const cachedProducts = getCachedData<Product[]>(CACHE_KEYS.PRODUCTS);

  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await productService.getAll();
      setCachedData(CACHE_KEYS.PRODUCTS, products);
      
      // ✅ PRELOAD ALL PRODUCT IMAGES - Use ORIGINAL URLs, not optimized
      const imageUrls = products
        .map(p => p.image)
        .filter((url): url is string => !!url && url.startsWith('http'));
      
      if (imageUrls.length > 0) {
        console.log(`🚀 Starting aggressive preload of ${imageUrls.length} product images...`);
        // Use setTimeout to not block the initial render
        setTimeout(() => {
          imagePreloader.preloadImages(imageUrls);
        }, 100);
      }
      
      return products;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: cachedProducts || undefined,
    enabled: !cachedProducts,
  });

  return query;
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['bestSellers'],
    queryFn: getBestSellers,
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      const products = await productService.getAll();
      return products.filter(product => product.category === categoryId);
    },
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('🔍 Checking cache for categories...');
      
      const cached = getCachedData<Category[]>(CACHE_KEYS.CATEGORIES);
      if (cached) {
        console.log('✅ Returning cached categories');
        return cached;
      }
      
      console.log('🔄 No cache, fetching categories from Firebase...');
      const categories = await categoryService.getAll();
      console.log(`📥 Received ${categories.length} categories from Firebase`);
      
      setCachedData(CACHE_KEYS.CATEGORIES, categories);
      return categories;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('🔍 Checking cache for brands...');
      
      const cached = getCachedData<Brand[]>(CACHE_KEYS.BRANDS);
      if (cached) {
        console.log('✅ Returning cached brands');
        return cached;
      }
      
      console.log('🔄 No cache, fetching brands from Firebase...');
      const brands = await brandService.getAll();
      console.log(`📥 Received ${brands.length} brands from Firebase`);
      
      setCachedData(CACHE_KEYS.BRANDS, brands);
      return brands;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Banners
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => bannerService.getAll(),
  });
};

export const useBannersByType = (type: string, page?: string) => {
  return useQuery({
    queryKey: ['banners', type, page],
    queryFn: () => getBannersByType(type, page),
  });
};

// PDF Catalogs
export const usePDFCatalogs = () => {
  return useQuery({
    queryKey: ['pdfCatalogs'],
    queryFn: () => pdfCatalogService.getAll(),
  });
};

export const useActivePDFCatalog = () => {
  return useQuery({
    queryKey: ['activePDFCatalog'],
    queryFn: getActivePDFCatalog,
  });
};

// Contact Messages
export const useCreateContactMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>) =>
      contactMessageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};
