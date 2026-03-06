'use client';

import { useState } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export function useNewsletter() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const subscribe = async (email: string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const emailLower = email.toLowerCase().trim();
            const docRef = doc(FIRESTORE, 'newsletterSubscribers', emailLower);

            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setError('This email is already subscribed.');
                setLoading(false);
                return false;
            }

            await setDoc(docRef, {
                email: emailLower,
                subscribedAt: serverTimestamp(),
            });

            setSuccess(true);
            return true;
        } catch (err: any) {
            console.error('Newsletter subscription error:', err);
            setError('Failed to subscribe. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { subscribe, loading, error, success };
}
