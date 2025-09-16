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
import { ContactMessage } from '@/types';

// Products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
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
    queryFn: () => categoryService.getAll(),
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getAll(),
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
