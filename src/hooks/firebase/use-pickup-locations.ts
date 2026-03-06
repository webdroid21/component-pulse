'use client';

import { useState, useEffect } from 'react';
import {
    doc,
    query,
    setDoc,
    deleteDoc,
    updateDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type PickupLocation = {
    id: string;
    name: string;
    address: string;
    instructions?: string;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
};

const COLLECTION = 'pickupLocations';

export function usePickupLocations() {
    const [locations, setLocations] = useState<PickupLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(FIRESTORE, COLLECTION));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results = snapshot.docs.map((document) => ({
                    ...document.data(),
                    id: document.id,
                })) as PickupLocation[];

                // Sort by active first, then by name
                results.sort((a, b) => {
                    if (a.isActive && !b.isActive) return -1;
                    if (!a.isActive && b.isActive) return 1;
                    return a.name.localeCompare(b.name);
                });

                setLocations(results);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching pickup locations:', err);
                setError('Failed to fetch pickup locations');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { locations, loading, error };
}

export function usePickupLocationMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createLocation = async (data: Omit<PickupLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true);
            setError(null);

            const docRef = doc(collection(FIRESTORE, COLLECTION));
            await setDoc(docRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return docRef.id;
        } catch (err: any) {
            console.error('Error creating pickup location:', err);
            setError(err.message || 'Failed to create pickup location');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateLocation = async (id: string, data: Partial<PickupLocation>) => {
        try {
            setLoading(true);
            setError(null);

            const docRef = doc(FIRESTORE, COLLECTION, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            return true;
        } catch (err: any) {
            console.error('Error updating pickup location:', err);
            setError(err.message || 'Failed to update pickup location');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteLocation = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteDoc(doc(FIRESTORE, COLLECTION, id));
            return true;
        } catch (err: any) {
            console.error('Error deleting pickup location:', err);
            setError(err.message || 'Failed to delete pickup location');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createLocation, updateLocation, deleteLocation, loading, error };
}
