import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  where,
  addDoc,
  getDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type DealItem = {
  id: string;
  name: string;
  description: string;
  content: string;
  price: number;
  originalPrice: number;
  coverImage?: string;
  productIds: string[];
  trainingModuleIds: string[];
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
};

// ----------------------------------------------------------------------

export function useDeals(options?: { isActive?: boolean; limit?: number }) {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'deals'), orderBy('createdAt', 'desc'));

    if (options?.isActive !== undefined) {
      q = query(q, where('isActive', '==', options.isActive));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as DealItem[];
        setDeals(options?.limit ? fetched.slice(0, options.limit) : fetched);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching deals:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options?.isActive, options?.limit]);

  return { deals, loading };
}

// ----------------------------------------------------------------------

export function useDeal(id?: string) {
  const [deal, setDeal] = useState<DealItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setDeal(null);
      setLoading(false);
      return;
    }

    const fetchDeal = async () => {
      try {
        const docRef = doc(db, 'deals', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDeal({ id: docSnap.id, ...docSnap.data() } as DealItem);
        } else {
          setDeal(null);
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  return { deal, loading };
}

// ----------------------------------------------------------------------

export function useDealMutations() {
  const [loading, setLoading] = useState(false);

  const createDeal = useCallback(async (data: Omit<DealItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'deals'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (id: string, data: Partial<DealItem>) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'deals', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeal = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'deals', id));
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createDeal, updateDeal, deleteDeal, loading };
}
