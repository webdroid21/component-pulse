'use client';

import type { Timestamp } from 'firebase/firestore';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type StoreSettings = {
  // General
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeLogo?: string;
  storeFavicon?: string;
  
  // Business
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxIncluded: boolean;
  
  // Shipping
  freeShippingThreshold: number;
  defaultShippingFee: number;
  
  // Orders
  minOrderAmount: number;
  maxOrderAmount: number;
  orderPrefix: string;
  
  // Notifications
  orderNotificationEmail: string;
  lowStockThreshold: number;
  lowStockNotification: boolean;
  
  // Social
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    tiktok?: string;
  };
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Meta
  updatedAt?: Timestamp;
  updatedBy?: string;
};

const SETTINGS_DOC = 'store';
const COLLECTION = 'settings';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Component Pulse',
  storeEmail: 'info@componentpulse.com',
  storePhone: '+256 700 000 000',
  storeAddress: 'Kampala, Uganda',
  currency: 'UGX',
  currencySymbol: 'UGX',
  taxRate: 18,
  taxIncluded: true,
  freeShippingThreshold: 100000,
  defaultShippingFee: 5000,
  minOrderAmount: 10000,
  maxOrderAmount: 10000000,
  orderPrefix: 'CP',
  orderNotificationEmail: 'orders@componentpulse.com',
  lowStockThreshold: 10,
  lowStockNotification: true,
  socialLinks: {},
};

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, SETTINGS_DOC);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as StoreSettings);
      } else {
        // Create default settings if not exists
        await setDoc(docRef, {
          ...DEFAULT_SETTINGS,
          updatedAt: serverTimestamp(),
        });
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

export function useSettingsMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = async (data: Partial<StoreSettings>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, SETTINGS_DOC);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateSettings,
  };
}
