'use client';

import type { DeliveryZone } from 'src/types/delivery-zone';

import { useState, useEffect } from 'react';
import {
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const COLLECTION = 'deliveryZones';

// ----------------------------------------------------------------------

export function useDeliveryZones(activeOnly = false) {
    const [zones, setZones] = useState<DeliveryZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const constraints: any[] = [];
        if (activeOnly) {
            constraints.push(where('isActive', '==', true));
        }

        const q = query(collection(FIRESTORE, COLLECTION), ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as DeliveryZone[];
                setZones(data.sort((a, b) => a.fee - b.fee));
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error listening to delivery zones:', err);
                setError('Failed to load delivery zones');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [activeOnly]);

    return { zones, loading, error };
}

// ----------------------------------------------------------------------

export type DeliveryZoneFormData = {
    name: string;
    description?: string;
    areas: string[];
    fee: number;
    estimatedDays: string;
    isActive: boolean;
};

export function useDeliveryZoneMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createZone = async (data: DeliveryZoneFormData): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const docData: Record<string, any> = {
                name: data.name,
                areas: data.areas,
                fee: data.fee,
                estimatedDays: data.estimatedDays,
                isActive: data.isActive,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            if (data.description) docData.description = data.description;

            await addDoc(collection(FIRESTORE, COLLECTION), docData);
            return true;
        } catch (err) {
            console.error('Error creating delivery zone:', err);
            setError('Failed to create delivery zone');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateZone = async (zoneId: string, data: Partial<DeliveryZoneFormData>): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const updateData: Record<string, any> = { updatedAt: serverTimestamp() };
            if (data.name !== undefined) updateData.name = data.name;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.areas !== undefined) updateData.areas = data.areas;
            if (data.fee !== undefined) updateData.fee = data.fee;
            if (data.estimatedDays !== undefined) updateData.estimatedDays = data.estimatedDays;
            if (data.isActive !== undefined) updateData.isActive = data.isActive;

            await updateDoc(doc(FIRESTORE, COLLECTION, zoneId), updateData);
            return true;
        } catch (err) {
            console.error('Error updating delivery zone:', err);
            setError('Failed to update delivery zone');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteZone = async (zoneId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await deleteDoc(doc(FIRESTORE, COLLECTION, zoneId));
            return true;
        } catch (err) {
            console.error('Error deleting delivery zone:', err);
            setError('Failed to delete delivery zone');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createZone, updateZone, deleteZone, loading, error };
}
