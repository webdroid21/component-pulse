import { useState, useEffect } from 'react';
import {
    doc,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    collection,
    onSnapshot,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';


// ----------------------------------------------------------------------

export type TestimonialItem = {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    rating: number;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
};

// ----------------------------------------------------------------------

export function useGetAllTestimonials() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedTestimonials = snapshot.docs.map((document) => ({
                    id: document.id,
                    ...document.data(),
                })) as TestimonialItem[];
                setTestimonials(fetchedTestimonials);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching all testimonials:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { testimonials, loading, error };
}

// ----------------------------------------------------------------------

export function useTestimonialMutations() {
    const [loading, setLoading] = useState(false);

    const updateTestimonialStatus = async (testimonialId: string, status: 'approved' | 'rejected') => {
        setLoading(true);
        try {
            const docRef = doc(db, 'testimonials', testimonialId);
            await updateDoc(docRef, { status });
            setLoading(false);
        } catch (error) {
            console.error('Error updating testimonial status:', error);
            setLoading(false);
            throw error;
        }
    };

    const deleteTestimonial = async (testimonialId: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'testimonials', testimonialId));
            setLoading(false);
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            setLoading(false);
            throw error;
        }
    };

    return {
        updateTestimonialStatus,
        deleteTestimonial,
        loading,
    };
}
