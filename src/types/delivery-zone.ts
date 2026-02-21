import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type DeliveryZone = {
    id: string;
    name: string;           // e.g. "Kampala Central"
    description?: string;  // e.g. "Covers Kampala CBD and surrounding areas"
    areas: string[];        // list of districts/neighbourhoods covered
    fee: number;            // delivery fee in UGX
    estimatedDays: string;  // e.g. "1-2 business days"
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
