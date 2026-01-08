'use client';

import type { Timestamp } from 'firebase/firestore';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type AdminRole = 'super_admin' | 'admin' | 'staff';

export type AdminUser = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
};

export type AdminFormData = {
  email: string;
  displayName: string;
  phone?: string;
  role: AdminRole;
  permissions?: string[];
  isActive?: boolean;
};

// ----------------------------------------------------------------------

const COLLECTION = 'admins';

export function useAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(FIRESTORE, COLLECTION));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as AdminUser[];

      setAdmins(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return { admins, loading, error, refetch: fetchAdmins };
}

export function useAdminMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdmin = async (uid: string, data: AdminFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await setDoc(doc(FIRESTORE, COLLECTION, uid), {
        uid,
        email: data.email,
        displayName: data.displayName,
        phone: data.phone || '',
        role: data.role,
        permissions: data.permissions || [],
        isActive: data.isActive ?? true,
        createdBy: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Failed to create admin');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (adminId: string, data: Partial<AdminFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, adminId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error updating admin:', err);
      setError('Failed to update admin');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminRole = async (adminId: string, role: AdminRole): Promise<boolean> => updateAdmin(adminId, { role });

  const toggleAdminStatus = async (adminId: string, isActive: boolean): Promise<boolean> => updateAdmin(adminId, { isActive });

  const deleteAdmin = async (adminId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(FIRESTORE, COLLECTION, adminId));
      return true;
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError('Failed to delete admin');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createAdmin,
    updateAdmin,
    updateAdminRole,
    toggleAdminStatus,
    deleteAdmin,
  };
}
