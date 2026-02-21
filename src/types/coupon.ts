import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type CouponType = 'percentage' | 'fixed';

export type Coupon = {
    id: string;
    code: string;                // e.g. "SAVE20"
    type: CouponType;            // percentage off or fixed amount off
    value: number;               // 20 for 20%, or 5000 for UGX 5,000
    minOrderAmount?: number;     // minimum cart subtotal to apply
    maxUses?: number;            // null = unlimited
    usedCount: number;
    isActive: boolean;
    expiresAt?: Timestamp;
    description?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
