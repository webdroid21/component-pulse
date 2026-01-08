import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'flutterwave' | 'mobile_money' | 'cash_on_delivery';

export type OrderItem = {
  productId: string;
  productName: string;
  productImage?: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  postalCode?: string;
  country: string;
  deliveryInstructions?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
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
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  estimatedDeliveryDate?: Timestamp;
  deliveredAt?: Timestamp;
  notes?: string;
  adminNotes?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: Timestamp;
    note?: string;
    updatedBy?: string;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type OrderFilters = {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
};
