export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price?: number;
  isBestSeller: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo?: string; // Changed from 'image' to 'logo'
  website?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image?: string;
  type: 'hero' | 'promotion' | 'sidebar' | 'footer';
  page: 'home' | 'products' | 'about' | 'contact' | 'all';
  position: string;
  isActive: boolean;
  order: number;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

// PDF Catalog Types
export interface PDFProductOrder {
  productId: string;
  order: number;
  included: boolean;
}

export interface PDFCategoryOrder {
  categoryId: string;
  categoryName: string;
  order: number;
  newPageStart: boolean;
  products?: PDFProductOrder[];
}

export interface PDFCatalog {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  coverPage?: string;
  backPage?: string;
  categories?: PDFCategoryOrder[];
  createdAt: Date;
  updatedAt: Date;
}