import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    query,
    where,
    setDoc,
    updateDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export interface NotificationRecord {
    id: string;
    userId: string; // The intended recipient (e.g. user ID, or 'admin')
    type: 'chat' | 'mail' | 'order' | 'delivery' | 'friend' | 'project' | 'file' | 'tags' | 'payment' | 'training';
    category: string;
    title: string;
    isUnRead: boolean;
    avatarUrl: string | null;
    link: string | null;
    createdAt: any;
}

// ----------------------------------------------------------------------

export function useGetNotifications() {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Determine the query target ID (either the current user ID, or 'admin' if they are an admin)
        // For this implementation, admins get standard notifications, plus 'admin' queue notifications.

        if (!user) {
            setNotifications([]);
            setLoading(false);
            return undefined;
        }

        const targetIds = user?.isAdmin ? ['admin', user.uid] : [user.uid];

        const q = query(
            collection(db, 'notifications'),
            where('userId', 'in', targetIds),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: NotificationRecord[] = [];
            snapshot.forEach((docSnapshot) => {
                results.push({ id: docSnapshot.id, ...docSnapshot.data() } as NotificationRecord);
            });

            // Sort in memory since we are using a 'where' clause that often conflicts with 'orderBy' 
            // without setting up a compound index in Firebase right away
            results.sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
            });

            setNotifications(results);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return { notifications, loading };
}

export function useNotificationMutations() {
    const [loading, setLoading] = useState(false);

    const createNotification = useCallback(
        async (
            data: Omit<NotificationRecord, 'id' | 'createdAt' | 'isUnRead'>
        ) => {
            setLoading(true);
            try {
                const notifRef = doc(collection(db, 'notifications'));
                await setDoc(notifRef, {
                    ...data,
                    isUnRead: true,
                    createdAt: serverTimestamp(),
                });
                setLoading(false);
            } catch (error) {
                console.error('Error creating notification:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    const markAllAsRead = useCallback(
        async (notificationsToUpdate: NotificationRecord[]) => {
            setLoading(true);
            try {
                const promises = notificationsToUpdate
                    .filter((n) => n.isUnRead)
                    .map((n) => {
                        const docRef = doc(db, 'notifications', n.id);
                        return updateDoc(docRef, { isUnRead: false });
                    });

                await Promise.all(promises);
                setLoading(false);
            } catch (error) {
                console.error('Error marking notifications read:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    const markAsRead = useCallback(
        async (notificationId: string) => {
            setLoading(true);
            try {
                const docRef = doc(db, 'notifications', notificationId);
                await updateDoc(docRef, { isUnRead: false });
                setLoading(false);
            } catch (error) {
                console.error('Error marking notification read:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    return { createNotification, markAllAsRead, markAsRead, loading };
}
