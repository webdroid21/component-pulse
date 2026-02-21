import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    query,
    orderBy,
    onSnapshot,
    setDoc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';

import { FIRESTORE as db } from 'src/lib/firebase';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface TicketMessage {
    id: string;
    senderId: string;
    senderRole: 'user' | 'admin' | 'system';
    senderName: string;
    content: string;
    attachments?: string[];
    createdAt: any;
}

export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    userId: string | null;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    createdAt: any;
    updatedAt: any;
}

// ----------------------------------------------------------------------

export function useGetTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Ticket[] = [];
            snapshot.forEach((docSnapshot) => {
                results.push({ id: docSnapshot.id, ...docSnapshot.data() } as Ticket);
            });
            setTickets(results);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { tickets, loading };
}

export function useGetUserTickets() {
    const { user } = useAuthContext();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setTickets([]);
            setLoading(false);
            return undefined;
        }

        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Ticket[] = [];
            snapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data() as Ticket;
                if (data.userId === user.uid) {
                    results.push({ ...data, id: docSnapshot.id });
                }
            });
            setTickets(results);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    return { tickets, loading };
}

export function useGetTicketDetails(ticketId: string) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ticketId) return undefined;

        const ticketRef = doc(db, 'tickets', ticketId);
        const messagesRef = collection(db, 'tickets', ticketId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeTicket = onSnapshot(ticketRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setTicket({ id: docSnapshot.id, ...docSnapshot.data() } as Ticket);
            } else {
                setTicket(null);
            }
        });

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            const results: TicketMessage[] = [];
            snapshot.forEach((docSnapshot) => {
                results.push({ id: docSnapshot.id, ...docSnapshot.data() } as TicketMessage);
            });
            setMessages(results);
            setLoading(false);
        });

        return () => {
            unsubscribeTicket();
            unsubscribeMessages();
        };
    }, [ticketId]);

    return { ticket, messages, loading };
}

export function useTicketMutations() {
    const [loading, setLoading] = useState(false);

    const createTicket = useCallback(
        async (
            ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>,
            initialMessage: string
        ) => {
            setLoading(true);
            try {
                const ticketRef = doc(collection(db, 'tickets'));
                const ticketId = ticketRef.id;

                // Generate a random ticket number
                const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

                const newTicket: any = {
                    ...ticketData,
                    ticketNumber,
                    status: 'open',
                    priority: 'medium',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };

                await setDoc(ticketRef, newTicket);

                // Add the initial message
                if (initialMessage) {
                    const messageRef = doc(collection(db, 'tickets', ticketId, 'messages'));
                    await setDoc(messageRef, {
                        senderId: ticketData.userId || 'ANONYMOUS',
                        senderRole: 'user',
                        senderName: ticketData.contactName,
                        content: initialMessage,
                        createdAt: serverTimestamp(),
                    });
                }

                setLoading(false);
                return ticketId;
            } catch (error) {
                console.error('Error creating ticket:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    const sendMessage = useCallback(
        async (ticketId: string, messageData: Omit<TicketMessage, 'id' | 'createdAt'>) => {
            setLoading(true);
            try {
                const messageRef = doc(collection(db, 'tickets', ticketId, 'messages'));
                await setDoc(messageRef, {
                    ...messageData,
                    createdAt: serverTimestamp(),
                });

                // Update the ticket's updatedAt timestamp
                const ticketRef = doc(db, 'tickets', ticketId);
                await updateDoc(ticketRef, {
                    updatedAt: serverTimestamp(),
                });

                setLoading(false);
            } catch (error) {
                console.error('Error sending message:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    const updateTicketStatus = useCallback(
        async (ticketId: string, status: TicketStatus) => {
            setLoading(true);
            try {
                const ticketRef = doc(db, 'tickets', ticketId);
                await updateDoc(ticketRef, {
                    status,
                    updatedAt: serverTimestamp(),
                });
                setLoading(false);
            } catch (error) {
                console.error('Error updating ticket status:', error);
                setLoading(false);
                throw error;
            }
        },
        []
    );

    return { createTicket, sendMessage, updateTicketStatus, loading };
}
