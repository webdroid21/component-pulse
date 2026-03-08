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

export type PostItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  coverUrl: string;
  tags: string[];
  metaKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  publish: boolean;
  enableComments: boolean;
  createdAt?: any;
  updatedAt?: any;
};

const COLLECTION = 'posts';

// ----------------------------------------------------------------------

export function usePosts(options?: { publish?: boolean; limit?: number }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

    if (options?.publish !== undefined) {
      q = query(q, where('publish', '==', options.publish));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as PostItem[];
        setPosts(options?.limit ? fetched.slice(0, options.limit) : fetched);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options?.publish, options?.limit]);

  return { posts, loading };
}

// ----------------------------------------------------------------------

export function usePost(id?: string) {
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const docRef = doc(db, COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as PostItem);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading };
}

// ----------------------------------------------------------------------

export function usePostMutations() {
  const [loading, setLoading] = useState(false);

  const createPost = useCallback(async (data: Omit<PostItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, data: Partial<PostItem>) => {
    setLoading(true);
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPost, updatePost, deletePost, loading };
}
