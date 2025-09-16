import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Category, Brand, Banner, ContactMessage, PDFCatalog } from '@/types';

// Helper to convert Firestore data with proper date handling
const convertFirestoreData = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
  } as T;
};

// Generic Firebase service
class FirebaseService<T extends { id: string }> {
  constructor(private collectionName: string) {}

  async getAll(): Promise<T[]> {
    if (!db) {
      console.warn(`Firebase not initialized. Using mock data for ${this.collectionName}.`);
      return [];
    }

    try {
      const q = query(
        collection(db, this.collectionName), 
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreData<T>(doc));
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    if (!db) {
      console.warn(`Firebase not initialized.`);
      return null;
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreData<T>(docSnap as QueryDocumentSnapshot<DocumentData>);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} by ID:`, error);
      return null;
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Specific services
export const productService = new FirebaseService<Product>('products');
export const categoryService = new FirebaseService<Category>('categories');
export const brandService = new FirebaseService<Brand>('brands');
export const bannerService = new FirebaseService<Banner>('banners');
export const contactMessageService = new FirebaseService<ContactMessage>('contactMessages');
export const pdfCatalogService = new FirebaseService<PDFCatalog>('pdfCatalogs');

// Custom methods for specific collections
export const getBannersByType = async (type: string, page?: string): Promise<Banner[]> => {
  if (!db) {
    console.warn('Firebase not initialized. Using mock data for banners.');
    return [];
  }

  try {
    let q = query(
      collection(db, 'banners'),
      where('type', '==', type),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );

    if (page) {
      q = query(
        collection(db, 'banners'),
        where('type', '==', type),
        where('page', 'in', [page, 'all']),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertFirestoreData<Banner>(doc));
  } catch (error) {
    console.error('Error fetching banners by type:', error);
    return [];
  }
};

export const getBestSellers = async (): Promise<Product[]> => {
  if (!db) {
    console.warn('Firebase not initialized. Using mock data for best sellers.');
    return [];
  }

  try {
    const q = query(
      collection(db, 'products'),
      where('isBestSeller', '==', true),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertFirestoreData<Product>(doc));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
};

// Get active PDF catalog
export const getActivePDFCatalog = async (): Promise<PDFCatalog | null> => {
  if (!db) {
    console.warn('Firebase not initialized.');
    return null;
  }

  try {
    const q = query(
      collection(db, 'pdfCatalogs'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return convertFirestoreData<PDFCatalog>(querySnapshot.docs[0]);
    }
    
    // Fallback: get the most recent catalog if no active one
    const fallbackQuery = query(
      collection(db, 'pdfCatalogs'),
      orderBy('createdAt', 'desc')
    );
    const fallbackSnapshot = await getDocs(fallbackQuery);
    
    if (!fallbackSnapshot.empty) {
      return convertFirestoreData<PDFCatalog>(fallbackSnapshot.docs[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching active PDF catalog:', error);
    return null;
  }
};