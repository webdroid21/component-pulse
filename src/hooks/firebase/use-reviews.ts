import { useState, useEffect } from 'react';
import {
  doc,
  query,
  where,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type ReviewItem = {
  id: string;
  productId: string;
  userId: string | null;
  name: string;
  email: string;
  rating: number;
  message: string;
  isApproved: boolean;
  createdAt: any;
  avatarUrl?: string; // Optional client-side only based on user
};

// ----------------------------------------------------------------------

export function useGetApprovedReviews(productId: string) {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setApprovedReviews([]);
      setLoading(false);
      return () => {};
    }

    const q = query(collection(db, 'reviews'), where('productId', '==', productId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as ReviewItem[];

        // Sort client-side to avoid Firebase composite index requirement
        fetchedReviews.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        // Separation of powers allowing dynamic client-side array views securely
        const approvedData = fetchedReviews.filter((r) => r.isApproved);
        const visibleData = fetchedReviews.filter(
          (r) => r.isApproved || (user && r.userId === user.uid)
        );

        setApprovedReviews(approvedData);
        setReviews(visibleData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching reviews:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId, user?.uid]); // Bind strictly matching Auth updates

  return { reviews, approvedReviews, loading, error };
}

// ----------------------------------------------------------------------

export function useGetAllReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as ReviewItem[];
        setReviews(fetchedReviews);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching all reviews:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { reviews, loading, error };
}

// ----------------------------------------------------------------------

export function useReviewMutations() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const addReview = async (reviewData: {
    productId: string;
    rating: number;
    message: string;
    name: string;
    email: string;
  }) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        userId: user?.uid || null,
        isApproved: false,
        createdAt: serverTimestamp(),
      });
      setLoading(false);
      return docRef.id;
    } catch (error) {
      console.error('Error adding review:', error);
      setLoading(false);
      throw error;
    }
  };

  const approveReview = async (reviewId: string, isApproved: boolean) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'reviews', reviewId);
      await updateDoc(docRef, { isApproved });
      setLoading(false);
    } catch (error) {
      console.error('Error approving review:', error);
      setLoading(false);
      throw error;
    }
  };

  const deleteReview = async (reviewId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setLoading(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      setLoading(false);
      throw error;
    }
  };

  return {
    addReview,
    approveReview,
    deleteReview,
    loading,
  };
}
