import { useState, useEffect, useCallback } from 'react';
import {
    query,
    where,
    addDoc,
    getDocs,
    collection,
    serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const COLLECTION = 'trainingSubscriptions';

// ----------------------------------------------------------------------

export function useTrainingSubscriptions(moduleId: string) {
    const { user } = useAuthContext();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check if already subscribed
    useEffect(() => {
        if (!user || !moduleId) {
            setChecking(false);
            return;
        }

        const checkSubscription = async () => {
            try {
                const q = query(
                    collection(db, COLLECTION),
                    where('userId', '==', user.uid),
                    where('moduleId', '==', moduleId)
                );
                const snapshot = await getDocs(q);
                setIsSubscribed(!snapshot.empty);
            } catch (err) {
                console.error('Error checking subscription:', err);
            } finally {
                setChecking(false);
            }
        };

        checkSubscription();
    }, [user, moduleId]);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!user || !moduleId) return false;

        // Prevent duplicate subscriptions
        if (isSubscribed) return true;

        setLoading(true);
        try {
            await addDoc(collection(db, COLLECTION), {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || '',
                moduleId,
                createdAt: serverTimestamp(),
            });
            setIsSubscribed(true);
            return true;
        } catch (err) {
            console.error('Error subscribing to training module:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, moduleId, isSubscribed]);

    return { isSubscribed, subscribe, loading, checking };
}
