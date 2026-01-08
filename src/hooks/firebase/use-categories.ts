'use client';

import type { Category, CategoryFormData, CategoryWithChildren } from 'src/types/category';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const COLLECTION = 'categories';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(FIRESTORE, COLLECTION), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Category[];

      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Build hierarchical structure
  const categoriesWithChildren: CategoryWithChildren[] = categories
    .filter((cat) => !cat.parentId)
    .map((parent) => ({
      ...parent,
      children: categories.filter((child) => child.parentId === parent.id),
    }));

  return { categories, categoriesWithChildren, loading, error, refetch: fetchCategories };
}

export function useCategory(categoryId: string | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(FIRESTORE, COLLECTION, categoryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCategory({ id: docSnap.id, ...docSnap.data() } as Category);
        } else {
          setError('Category not found');
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to fetch category');
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (data: CategoryFormData): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const slug = generateSlug(data.name);
      const docRef = await addDoc(collection(FIRESTORE, COLLECTION), {
        ...data,
        slug,
        productCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, data: Partial<CategoryFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, categoryId);
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if (data.name) {
        updateData.slug = generateSlug(data.name);
      }

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(FIRESTORE, COLLECTION, categoryId));
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
