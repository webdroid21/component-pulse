'use client';

import type { UserProfile, UserAddress, UserProfileFormData } from 'src/types/user';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const COLLECTION = 'users';

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

export function useUserProfileMutations() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: Partial<UserProfileFormData>): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if (data.firstName || data.lastName) {
        updateData.displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      }

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<UserAddress, 'id'>): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const newAddress: UserAddress = {
        ...address,
        id: `addr_${Date.now()}`,
      };

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      await updateDoc(docRef, {
        addresses: arrayUnion(newAddress),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error adding address:', err);
      setError('Failed to add address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, data: Partial<UserAddress>): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('Profile not found');
        return false;
      }

      const profile = docSnap.data() as UserProfile;
      const addresses = profile.addresses || [];
      const updatedAddresses = addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...data } : addr
      );

      await updateDoc(docRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error updating address:', err);
      setError('Failed to update address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (address: UserAddress): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      await updateDoc(docRef, {
        addresses: arrayRemove(address),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      await updateDoc(docRef, {
        defaultAddressId: addressId,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Failed to set default address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      await updateDoc(docRef, {
        wishlist: arrayUnion(productId),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, user.uid);
      await updateDoc(docRef, {
        wishlist: arrayRemove(productId),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    addToWishlist,
    removeFromWishlist,
  };
}
