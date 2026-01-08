'use client';

import type { Order, OrderStatus, OrderFilters } from 'src/types/order';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  Timestamp,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const COLLECTION = 'orders';

export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(collection(FIRESTORE, COLLECTION), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.paymentStatus) {
        q = query(q, where('paymentStatus', '==', filters.paymentStatus));
      }

      if (filters?.customerId) {
        q = query(q, where('customerId', '==', filters.customerId));
      }

      const snapshot = await getDocs(q);
      let data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];

      // Client-side filtering for search and date range
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        data = data.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.customerEmail.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.dateFrom) {
        const fromTimestamp = Timestamp.fromDate(filters.dateFrom);
        data = data.filter((order) => order.createdAt >= fromTimestamp);
      }

      if (filters?.dateTo) {
        const toTimestamp = Timestamp.fromDate(filters.dateTo);
        data = data.filter((order) => order.createdAt <= toTimestamp);
      }

      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.paymentStatus, filters?.customerId, filters?.search, filters?.dateFrom, filters?.dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

export function useOrderMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    note?: string,
    updatedBy?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('Order not found');
        return false;
      }

      const currentOrder = docSnap.data() as Order;
      const statusHistory = currentOrder.statusHistory || [];

      const updateData: Record<string, any> = {
        status,
        statusHistory: [
          ...statusHistory,
          {
            status,
            timestamp: serverTimestamp(),
            note,
            updatedBy,
          },
        ],
        updatedAt: serverTimestamp(),
      };

      if (status === 'delivered') {
        updateData.deliveredAt = serverTimestamp();
      }

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addOrderNote = async (orderId: string, note: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, orderId);
      await updateDoc(docRef, {
        adminNotes: note,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error('Error adding order note:', err);
      setError('Failed to add note');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateOrderStatus,
    addOrderNote,
  };
}

export function useCustomerOrders(customerId: string | null) {
  return useOrders(customerId ? { customerId } : undefined);
}
