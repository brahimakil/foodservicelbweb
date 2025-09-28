import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SystemSettings {
  id: string;
  geminiApiKey?: string;
  aiEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class SettingsService {
  private collectionName = 'systemSettings';
  private docId = 'main';

  async getSettings(): Promise<SystemSettings | null> {
    try {
      const docRef = doc(db, this.collectionName, this.docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SystemSettings;
      }
      return null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }
}

export const settingsService = new SettingsService();
