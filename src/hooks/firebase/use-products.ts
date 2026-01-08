'use client';

import type { Product, ProductFilters, ProductFormData } from 'src/types/product';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  where,
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

const COLLECTION = 'products';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(collection(FIRESTORE, COLLECTION), orderBy('createdAt', 'desc'));

      if (filters?.categoryId) {
        q = query(q, where('categoryId', '==', filters.categoryId));
      }

      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }

      const snapshot = await getDocs(q);
      let data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Product[];

      // Client-side filtering for search
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        data = data.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.inStock) {
        data = data.filter((product) => product.stock > 0);
      }

      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters?.categoryId, filters?.isActive, filters?.search, filters?.inStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(FIRESTORE, COLLECTION, productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}

export function useProductMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: ProductFormData): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const slug = generateSlug(data.name);
      const docRef = await addDoc(collection(FIRESTORE, COLLECTION), {
        ...data,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, data: Partial<ProductFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, productId);
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
      console.error('Error updating product:', err);
      setError('Failed to update product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(FIRESTORE, COLLECTION, productId));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean): Promise<boolean> => updateProduct(productId, { isActive });

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  };
}
