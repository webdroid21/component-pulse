'use client';

import type { Timestamp } from 'firebase/firestore';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type Customer = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoURL?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  addresses?: CustomerAddress[];
  wishlist?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
};

export type CustomerAddress = {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
};

// ----------------------------------------------------------------------

const COLLECTION = 'users';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(FIRESTORE, COLLECTION));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Customer[];

      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, loading, error, refetch: fetchCustomers };
}

export function useCustomer(customerId: string | null) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(FIRESTORE, COLLECTION, customerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCustomer({ id: docSnap.id, ...docSnap.data() } as Customer);
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to fetch customer');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [customerId]);

  return { customer, loading, error };
}

export function useCustomerMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomer = async (customerId: string, data: Partial<Customer>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, customerId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerStatus = async (customerId: string, isActive: boolean): Promise<boolean> => updateCustomer(customerId, { isActive });

  const deleteCustomer = async (customerId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(FIRESTORE, COLLECTION, customerId));
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateCustomer,
    toggleCustomerStatus,
    deleteCustomer,
  };
}
