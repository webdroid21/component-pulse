'use client';

import type { Order, OrderItem, OrderStatus, OrderFilters, OrderAddress, PaymentMethod, PaymentStatus } from 'src/types/order';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  increment,
  Timestamp,
  collection,
  runTransaction,
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

      // Build query constraints - where clauses must come before orderBy
      const constraints: any[] = [];

      if (filters?.customerId) {
        constraints.push(where('customerId', '==', filters.customerId));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.paymentStatus) {
        constraints.push(where('paymentStatus', '==', filters.paymentStatus));
      }

      // Add orderBy last
      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(FIRESTORE, COLLECTION), ...constraints);

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

// ----------------------------------------------------------------------

export type CreateOrderData = {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: OrderAddress;
  notes?: string;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
};

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CP-${timestamp}-${random}`;
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (data: CreateOrderData): Promise<{ orderId: string; orderNumber: string } | null> => {
    try {
      setLoading(true);
      setError(null);

      const orderNumber = generateOrderNumber();

      // Use transaction to create order and update stock atomically
      const result = await runTransaction(FIRESTORE, async (transaction) => {
        // First, verify stock availability for all items
        for (const item of data.items) {
          const productRef = doc(FIRESTORE, 'products', item.productId);
          const productSnap = await transaction.get(productRef);
          
          if (!productSnap.exists()) {
            throw new Error(`Product ${item.productName} no longer exists`);
          }
          
          const productData = productSnap.data();
          const currentStock = productData.stock || productData.quantity || 0;
          
          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productName}. Available: ${currentStock}`);
          }
        }

        // Create the order
        const orderRef = doc(collection(FIRESTORE, COLLECTION));
        const orderData: Record<string, any> = {
          orderNumber,
          customerId: data.customerId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          items: data.items,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          discount: data.discount,
          total: data.total,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          statusHistory: [
            {
              status: 'pending',
              timestamp: Timestamp.now(),
              note: 'Order placed',
            },
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // Only add optional fields if they have values (Firestore doesn't accept undefined)
        if (data.couponCode) orderData.couponCode = data.couponCode;
        if (data.deliveryZoneId) orderData.deliveryZoneId = data.deliveryZoneId;
        if (data.deliveryZoneName) orderData.deliveryZoneName = data.deliveryZoneName;
        if (data.notes) orderData.notes = data.notes;

        transaction.set(orderRef, orderData);

        // Reduce stock for each product
        for (const item of data.items) {
          const productRef = doc(FIRESTORE, 'products', item.productId);
          transaction.update(productRef, {
            stock: increment(-item.quantity),
            quantity: increment(-item.quantity),
            updatedAt: serverTimestamp(),
          });
        }

        return { orderId: orderRef.id, orderNumber };
      });

      return result;
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}

export function useUpdatePaymentStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentReference?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(FIRESTORE, COLLECTION, orderId);
      const updateData: Record<string, any> = {
        paymentStatus,
        updatedAt: serverTimestamp(),
      };

      if (paymentReference) {
        updateData.paymentReference = paymentReference;
      }

      // If payment is successful, also update order status to confirmed
      if (paymentStatus === 'paid') {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentOrder = docSnap.data() as Order;
          if (currentOrder.status === 'pending') {
            updateData.status = 'confirmed';
            updateData.statusHistory = [
              ...(currentOrder.statusHistory || []),
              {
                status: 'confirmed',
                timestamp: serverTimestamp(),
                note: 'Payment confirmed',
              },
            ];
          }
        }
      }

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.error('Error updating payment status:', err);
      setError('Failed to update payment status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePaymentStatus, loading, error };
}
