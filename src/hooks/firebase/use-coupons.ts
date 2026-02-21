'use client';

import type { Coupon, CouponType } from 'src/types/coupon';

import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    collection,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const COLLECTION = 'coupons';

// ----------------------------------------------------------------------

export function useCoupons(activeOnly = false) {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
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
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Coupon[];
                setCoupons(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error listening to coupons:', err);
                setError('Failed to load coupons');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [activeOnly]);

    return { coupons, loading, error };
}

// ----------------------------------------------------------------------

export type CouponFormData = {
    code: string;
    type: CouponType;
    value: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive: boolean;
    expiresAt?: Date | null;
    description?: string;
};

export function useCouponMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCoupon = async (data: CouponFormData): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const docData: Record<string, any> = {
                code: data.code.trim().toUpperCase(),
                type: data.type,
                value: data.value,
                isActive: data.isActive,
                usedCount: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            if (data.minOrderAmount) docData.minOrderAmount = data.minOrderAmount;
            if (data.maxUses) docData.maxUses = data.maxUses;
            if (data.description) docData.description = data.description;
            if (data.expiresAt) docData.expiresAt = Timestamp.fromDate(data.expiresAt);

            await addDoc(collection(FIRESTORE, COLLECTION), docData);
            return true;
        } catch (err) {
            console.error('Error creating coupon:', err);
            setError('Failed to create coupon');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateCoupon = async (couponId: string, data: Partial<CouponFormData>): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const updateData: Record<string, any> = { updatedAt: serverTimestamp() };
            if (data.code !== undefined) updateData.code = data.code.trim().toUpperCase();
            if (data.type !== undefined) updateData.type = data.type;
            if (data.value !== undefined) updateData.value = data.value;
            if (data.isActive !== undefined) updateData.isActive = data.isActive;
            if (data.minOrderAmount !== undefined) updateData.minOrderAmount = data.minOrderAmount || null;
            if (data.maxUses !== undefined) updateData.maxUses = data.maxUses || null;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.expiresAt !== undefined) {
                updateData.expiresAt = data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null;
            }

            await updateDoc(doc(FIRESTORE, COLLECTION, couponId), updateData);
            return true;
        } catch (err) {
            console.error('Error updating coupon:', err);
            setError('Failed to update coupon');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteCoupon = async (couponId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await deleteDoc(doc(FIRESTORE, COLLECTION, couponId));
            return true;
        } catch (err) {
            console.error('Error deleting coupon:', err);
            setError('Failed to delete coupon');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createCoupon, updateCoupon, deleteCoupon, loading, error };
}

// ----------------------------------------------------------------------

/** Validates a coupon code against the cart subtotal.
 *  Returns the coupon if valid, or an error string if not. */
export function useValidateCoupon() {
    const [validating, setValidating] = useState(false);

    const validateCoupon = useCallback(
        async (
            code: string,
            subtotal: number
        ): Promise<{ coupon: Coupon | null; error: string | null }> => {
            if (!code.trim()) return { coupon: null, error: 'Enter a coupon code' };

            setValidating(true);
            try {
                const q = query(
                    collection(FIRESTORE, COLLECTION),
                    where('code', '==', code.trim().toUpperCase()),
                    where('isActive', '==', true)
                );

                // One-shot fetch for validation
                const { getDocs } = await import('firebase/firestore');
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    return { coupon: null, error: 'Invalid or expired coupon code' };
                }

                const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;

                // Check expiry
                if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) {
                    return { coupon: null, error: 'This coupon has expired' };
                }

                // Check max uses
                if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                    return { coupon: null, error: 'This coupon has reached its usage limit' };
                }

                // Check minimum order amount
                if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
                    return {
                        coupon: null,
                        error: `Minimum order amount of UGX ${coupon.minOrderAmount.toLocaleString()} required`,
                    };
                }

                return { coupon, error: null };
            } catch (err) {
                console.error('Error validating coupon:', err);
                return { coupon: null, error: 'Failed to validate coupon' };
            } finally {
                setValidating(false);
            }
        },
        []
    );

    /** Increment usedCount after a successful order */
    const incrementCouponUsage = useCallback(async (couponId: string): Promise<void> => {
        try {
            const { increment } = await import('firebase/firestore');
            await updateDoc(doc(FIRESTORE, COLLECTION, couponId), {
                usedCount: increment(1),
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error('Error incrementing coupon usage:', err);
        }
    }, []);

    return { validateCoupon, incrementCouponUsage, validating };
}
