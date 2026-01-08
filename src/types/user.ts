import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type UserAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoURL?: string;
  dateOfBirth?: Timestamp;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  addresses?: UserAddress[];
  defaultAddressId?: string;
  wishlist?: string[];
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
};

export type UserProfileFormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
};
