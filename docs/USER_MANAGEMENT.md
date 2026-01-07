# ComponentPulse - User Management & Permissions System

## Overview

This document outlines the complete user management system including:
- User types and roles
- Permission matrix
- Authentication flows
- Firebase implementation
- Security rules

---

## User Types

### 1. Customer (Public User)

Regular users who browse and purchase products.

| Attribute | Description |
|-----------|-------------|
| **Registration** | Email/Password, Google OAuth, Phone OTP |
| **Access** | Public storefront, own account, orders |
| **Stored In** | Firestore `/users/{userId}` |

### 2. Admin Users

Internal team members with varying access levels.

| Role | Description |
|------|-------------|
| **Super Admin** | Full system access, manages other admins |
| **Admin** | Manages products, orders, customers |
| **Staff** | Limited access, basic order processing |

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                     SUPER ADMIN                          │
│  • Full system access                                    │
│  • Manage all admin users                                │
│  • System settings & configuration                       │
│  • Delivery zones & pickup locations                     │
│  • View all reports & analytics                          │
│  • Delete/restore anything                               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                        ADMIN                             │
│  • Product management (CRUD)                             │
│  • Category management                                   │
│  • Order management (full)                               │
│  • Customer management (view, disable)                   │
│  • Deals & promotions                                    │
│  • Returns processing                                    │
│  • View reports                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                        STAFF                             │
│  • View products (read-only)                             │
│  • View orders                                           │
│  • Update order status (limited)                         │
│  • View customers (read-only)                            │
│  • Process pickups                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Permission Matrix

### Product Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View products | ✅ | ✅ | ✅ | ✅ |
| Create product | ✅ | ✅ | ❌ | ❌ |
| Edit product | ✅ | ✅ | ❌ | ❌ |
| Delete product | ✅ | ✅ | ❌ | ❌ |
| Archive/Restore product | ✅ | ✅ | ❌ | ❌ |
| Bulk import products | ✅ | ✅ | ❌ | ❌ |
| Manage variants | ✅ | ✅ | ❌ | ❌ |
| Set stock levels | ✅ | ✅ | ❌ | ❌ |
| View stock alerts | ✅ | ✅ | ✅ | ❌ |

### Category Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View categories | ✅ | ✅ | ✅ | ✅ |
| Create category | ✅ | ✅ | ❌ | ❌ |
| Edit category | ✅ | ✅ | ❌ | ❌ |
| Delete category | ✅ | ❌ | ❌ | ❌ |
| Reorder categories | ✅ | ✅ | ❌ | ❌ |

### Order Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View all orders | ✅ | ✅ | ✅ | ❌ |
| View own orders | ✅ | ✅ | ✅ | ✅ |
| Update order status | ✅ | ✅ | ⚠️ Limited | ❌ |
| Cancel order | ✅ | ✅ | ❌ | ⚠️ Own only |
| Add order notes | ✅ | ✅ | ✅ | ❌ |
| Process refund | ✅ | ✅ | ❌ | ❌ |
| Delete order | ✅ | ❌ | ❌ | ❌ |
| Export orders | ✅ | ✅ | ❌ | ❌ |

**Staff Limitations:**
- Can only update status: `processing` → `shipped` → `out_for_delivery`
- Cannot change to: `confirmed`, `delivered`, `cancelled`

### Customer Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View all customers | ✅ | ✅ | ✅ | ❌ |
| View customer details | ✅ | ✅ | ✅ | ❌ |
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Edit customer | ✅ | ✅ | ❌ | ❌ |
| Disable customer | ✅ | ✅ | ❌ | ❌ |
| Delete customer | ✅ | ❌ | ❌ | ❌ |
| View customer orders | ✅ | ✅ | ✅ | ❌ |

### Admin User Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View admin users | ✅ | ❌ | ❌ | ❌ |
| Create admin user | ✅ | ❌ | ❌ | ❌ |
| Edit admin user | ✅ | ❌ | ❌ | ❌ |
| Change admin role | ✅ | ❌ | ❌ | ❌ |
| Disable admin | ✅ | ❌ | ❌ | ❌ |
| Delete admin | ✅ | ❌ | ❌ | ❌ |
| View activity logs | ✅ | ❌ | ❌ | ❌ |

### Delivery & Pickup Management

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View delivery zones | ✅ | ✅ | ✅ | ✅ |
| Create delivery zone | ✅ | ❌ | ❌ | ❌ |
| Edit delivery zone | ✅ | ❌ | ❌ | ❌ |
| Delete delivery zone | ✅ | ❌ | ❌ | ❌ |
| Set zone pricing | ✅ | ❌ | ❌ | ❌ |
| View pickup locations | ✅ | ✅ | ✅ | ✅ |
| Manage pickup locations | ✅ | ❌ | ❌ | ❌ |
| Assign deliveries | ✅ | ✅ | ❌ | ❌ |
| Mark pickup ready | ✅ | ✅ | ✅ | ❌ |

### Deals & Promotions

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View deals | ✅ | ✅ | ✅ | ✅ |
| Create deal | ✅ | ✅ | ❌ | ❌ |
| Edit deal | ✅ | ✅ | ❌ | ❌ |
| Delete deal | ✅ | ✅ | ❌ | ❌ |
| Manage coupons | ✅ | ✅ | ❌ | ❌ |

### Returns & Refunds

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| Request return | ❌ | ❌ | ❌ | ✅ |
| View return requests | ✅ | ✅ | ✅ | ⚠️ Own only |
| Approve return | ✅ | ✅ | ❌ | ❌ |
| Reject return | ✅ | ✅ | ❌ | ❌ |
| Process refund | ✅ | ✅ | ❌ | ❌ |

### Reports & Analytics

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| View dashboard | ✅ | ✅ | ⚠️ Limited | ❌ |
| Sales reports | ✅ | ✅ | ❌ | ❌ |
| Product reports | ✅ | ✅ | ❌ | ❌ |
| Customer reports | ✅ | ✅ | ❌ | ❌ |
| Export reports | ✅ | ✅ | ❌ | ❌ |
| View activity logs | ✅ | ❌ | ❌ | ❌ |

### System Settings

| Action | Super Admin | Admin | Staff | Customer |
|--------|:-----------:|:-----:|:-----:|:--------:|
| App configuration | ✅ | ❌ | ❌ | ❌ |
| Business info | ✅ | ❌ | ❌ | ❌ |
| Return policy settings | ✅ | ❌ | ❌ | ❌ |
| Free shipping threshold | ✅ | ❌ | ❌ | ❌ |
| Email templates | ✅ | ❌ | ❌ | ❌ |

---

## Firebase Data Structures

### Customer User Document

**Collection:** `/users/{userId}`

```typescript
interface User {
  // Firebase Auth UID
  uid: string;

  // Profile
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoURL?: string;

  // Account
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;

  // Preferences
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### Customer Addresses (Subcollection)

**Collection:** `/users/{userId}/addresses/{addressId}`

```typescript
interface Address {
  id: string;
  label: string; // "Home", "Work", etc.
  fullName: string;
  phone: string;
  region: string;
  district: string;
  area: string;
  streetAddress: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: Timestamp;
}
```

### Admin User Document

**Collection:** `/admins/{adminId}`

```typescript
interface AdminUser {
  // Firebase Auth UID
  uid: string;

  // Profile
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;

  // Role & Permissions
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[]; // Optional custom permissions override

  // Account
  isActive: boolean;

  // Audit
  createdBy: string; // UID of admin who created this user
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### Admin Activity Log

**Collection:** `/adminLogs/{logId}`

```typescript
interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string; // "create_product", "update_order", etc.
  resource: string; // "products", "orders", etc.
  resourceId?: string;
  details: {
    before?: any;
    after?: any;
    description: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}
```

---

## Firebase Authentication Setup

### 1. Enable Auth Providers

In Firebase Console → Authentication → Sign-in method:

```
✅ Email/Password
✅ Google
✅ Phone
```

### 2. Firebase Auth Configuration

```typescript
// lib/firebase/config.ts

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### 3. Auth Context Provider

```typescript
// lib/firebase/auth-context.tsx

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role?: 'super_admin' | 'admin' | 'staff';
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: string | null;

  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Check if admin
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            role: adminData.role,
            isAdmin: true,
          });
        } else {
          // Regular user
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            isAdmin: false,
          });
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      displayName: profileData.displayName || '',
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      phone: profileData.phone || '',
      isEmailVerified: false,
      isPhoneVerified: false,
      isActive: true,
      newsletter: false,
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    // Send verification email
    await sendEmailVerification(newUser);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user: googleUser } = await signInWithPopup(auth, provider);

    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', googleUser.uid));
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', googleUser.uid), {
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName || '',
        firstName: googleUser.displayName?.split(' ')[0] || '',
        lastName: googleUser.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: googleUser.photoURL,
        isEmailVerified: googleUser.emailVerified,
        isPhoneVerified: false,
        isActive: true,
        newsletter: false,
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAdmin: userData?.isAdmin || false,
    role: userData?.role || null,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## Firebase Security Rules

### Firestore Rules

```javascript
// firestore.rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function isSuperAdmin() {
      return isAdmin() &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
    }

    function isAdminOrHigher() {
      return isAdmin() &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role in ['super_admin', 'admin'];
    }

    function isActiveAdmin() {
      return isAdmin() &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isActive == true;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isActiveAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdminOrHigher();
      allow delete: if isSuperAdmin();

      // User addresses subcollection
      match /addresses/{addressId} {
        allow read, write: if isOwner(userId);
        allow read: if isActiveAdmin();
      }
    }

    // Admins collection
    match /admins/{adminId} {
      allow read: if isOwner(adminId) || isSuperAdmin();
      allow create: if isSuperAdmin();
      allow update: if isSuperAdmin();
      allow delete: if isSuperAdmin();
    }

    // Admin activity logs
    match /adminLogs/{logId} {
      allow read: if isSuperAdmin();
      allow create: if isActiveAdmin();
      allow update, delete: if false; // Logs are immutable
    }

    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read
      allow create, update: if isAdminOrHigher();
      allow delete: if isAdminOrHigher();

      // Product reviews
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if isAuthenticated();
        allow update, delete: if isOwner(resource.data.userId) || isAdminOrHigher();
      }
    }

    // Categories collection
    match /categories/{categoryId} {
      allow read: if true; // Public read
      allow create, update: if isAdminOrHigher();
      allow delete: if isSuperAdmin();
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isActiveAdmin();
      allow create: if isAuthenticated();
      allow update: if isActiveAdmin();
      allow delete: if isSuperAdmin();
    }

    // Carts collection
    match /carts/{cartId} {
      allow read, write: if isOwner(resource.data.userId) ||
                           (isAuthenticated() && request.auth.uid == cartId);
    }

    // Delivery zones
    match /deliveryZones/{zoneId} {
      allow read: if true; // Public read
      allow create, update, delete: if isSuperAdmin();
    }

    // Pickup locations
    match /pickupLocations/{locationId} {
      allow read: if true; // Public read
      allow create, update, delete: if isSuperAdmin();
    }

    // Deals
    match /deals/{dealId} {
      allow read: if true; // Public read
      allow create, update, delete: if isAdminOrHigher();
    }

    // Coupons
    match /coupons/{couponId} {
      allow read: if isAuthenticated(); // Users can validate coupons
      allow create, update, delete: if isAdminOrHigher();
    }

    // Return requests
    match /returns/{returnId} {
      allow read: if isOwner(resource.data.userId) || isActiveAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdminOrHigher();
      allow delete: if isSuperAdmin();
    }

    // Settings (single document)
    match /settings/{document} {
      allow read: if true; // Some settings are public
      allow write: if isSuperAdmin();
    }
  }
}
```

### Firebase Storage Rules

```javascript
// storage.rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return request.auth != null &&
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }

    // Product images - admins can upload, everyone can read
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Category images
    match /categories/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // User profile pictures
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Return request images
    match /returns/{returnId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    // Deal images
    match /deals/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## Authentication Flows

### 1. Customer Registration Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Sign Up     │────▶│ Create Firebase │────▶│ Create Firestore │
│  Form        │     │ Auth Account    │     │ User Document    │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                                                      ▼
                     ┌─────────────────┐     ┌──────────────────┐
                     │ Redirect to     │◀────│ Send Verification│
                     │ Account Page    │     │ Email            │
                     └─────────────────┘     └──────────────────┘
```

### 2. Customer Login Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Login       │────▶│ Firebase Auth   │────▶│ Check Admin      │
│  Form        │     │ Sign In         │     │ Collection       │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                            ┌─────────────────────────┼─────────────────────────┐
                            ▼                         ▼                         │
                     ┌──────────────┐          ┌──────────────┐                 │
                     │ Is Admin?    │          │ Is Customer? │                 │
                     │ YES          │          │ YES          │                 │
                     └──────┬───────┘          └──────┬───────┘                 │
                            ▼                         ▼                         │
                     ┌──────────────┐          ┌──────────────┐                 │
                     │ Redirect to  │          │ Redirect to  │                 │
                     │ /admin       │          │ /account     │                 │
                     └──────────────┘          └──────────────┘                 │
```

### 3. Admin Login Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Admin       │────▶│ Firebase Auth   │────▶│ Check /admins    │
│  Login Form  │     │ Sign In         │     │ Collection       │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                            ┌─────────────────────────┴─────────────────────────┐
                            ▼                                                   ▼
                     ┌──────────────┐                                   ┌──────────────┐
                     │ Admin Doc    │                                   │ Not Admin    │
                     │ Exists &     │                                   │ Show Error   │
                     │ isActive     │                                   │ Sign Out     │
                     └──────┬───────┘                                   └──────────────┘
                            ▼
                     ┌──────────────┐
                     │ Update       │
                     │ lastLoginAt  │
                     └──────┬───────┘
                            ▼
                     ┌──────────────┐
                     │ Redirect to  │
                     │ /admin/      │
                     │ dashboard    │
                     └──────────────┘
```

### 4. Password Reset Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Forgot      │────▶│ Firebase        │────▶│ Show Success     │
│  Password    │     │ sendPassword-   │     │ Message          │
│  Form        │     │ ResetEmail      │     │                  │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                                                      ▼
                     ┌─────────────────┐     ┌──────────────────┐
                     │ Firebase        │◀────│ User Clicks      │
                     │ Updates         │     │ Email Link       │
                     │ Password        │     │                  │
                     └─────────────────┘     └──────────────────┘
```

---

## Admin User Management

### Creating First Super Admin

Since there's no admin initially, the first Super Admin must be created manually:

1. **Create user via Firebase Auth** (Console or CLI)
2. **Add document to `/admins` collection:**

```typescript
// Run once via Firebase Console or admin script

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase/config';

async function createFirstSuperAdmin(uid: string, email: string) {
  await setDoc(doc(db, 'admins', uid), {
    uid,
    email,
    displayName: 'Super Admin',
    role: 'super_admin',
    permissions: [],
    isActive: true,
    createdBy: 'system',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: null,
  });
}
```

### Admin Creation by Super Admin

```typescript
// services/admin-service.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';

interface CreateAdminData {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'staff';
  phone?: string;
}

export async function createAdminUser(
  data: CreateAdminData,
  createdByUid: string
): Promise<string> {
  // Create Firebase Auth account
  const { user } = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  // Create admin document
  await setDoc(doc(db, 'admins', user.uid), {
    uid: user.uid,
    email: data.email,
    displayName: data.displayName,
    phone: data.phone || '',
    role: data.role,
    permissions: [],
    isActive: true,
    createdBy: createdByUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: null,
  });

  // Log activity
  await logAdminActivity(createdByUid, 'create_admin', 'admins', user.uid, {
    description: `Created new ${data.role}: ${data.email}`,
  });

  return user.uid;
}
```

---

## Permission Checking Hooks

```typescript
// hooks/use-permissions.ts

import { useAuth } from '@/lib/firebase/auth-context';

type Permission =
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'orders.view'
  | 'orders.update'
  | 'orders.delete'
  | 'customers.view'
  | 'customers.edit'
  | 'customers.delete'
  | 'admins.manage'
  | 'settings.manage'
  | 'delivery.manage'
  | 'returns.process';

const rolePermissions: Record<string, Permission[]> = {
  super_admin: [
    'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.update', 'orders.delete',
    'customers.view', 'customers.edit', 'customers.delete',
    'admins.manage', 'settings.manage', 'delivery.manage',
    'returns.process',
  ],
  admin: [
    'products.create', 'products.edit', 'products.delete',
    'orders.view', 'orders.update',
    'customers.view', 'customers.edit',
    'returns.process',
  ],
  staff: [
    'orders.view', 'orders.update',
    'customers.view',
  ],
};

export function usePermissions() {
  const { userData, isAdmin, role } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!isAdmin || !role) return false;
    return rolePermissions[role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((p) => hasPermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin: role === 'super_admin',
    isAdminOrHigher: role === 'super_admin' || role === 'admin',
    isStaff: role === 'staff',
  };
}
```

### Protected Route Component

```typescript
// components/admin/protected-route.tsx

'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { usePermissions } from '@/hooks/use-permissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'super_admin' | 'admin' | 'staff';
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
}: ProtectedRouteProps) {
  const { loading, isAdmin, role } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        router.push('/admin/login');
        return;
      }

      if (requiredRole) {
        const roleHierarchy = ['staff', 'admin', 'super_admin'];
        const userRoleIndex = roleHierarchy.indexOf(role || '');
        const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

        if (userRoleIndex < requiredRoleIndex) {
          router.push('/admin/unauthorized');
          return;
        }
      }

      if (requiredPermission && !hasPermission(requiredPermission as any)) {
        router.push('/admin/unauthorized');
        return;
      }
    }
  }, [loading, isAdmin, role, requiredPermission, requiredRole, router, hasPermission]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
```

---

## Activity Logging

```typescript
// services/activity-log.ts

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface LogDetails {
  before?: any;
  after?: any;
  description: string;
}

export async function logAdminActivity(
  adminId: string,
  action: string,
  resource: string,
  resourceId: string | null,
  details: LogDetails
) {
  await addDoc(collection(db, 'adminLogs'), {
    adminId,
    action,
    resource,
    resourceId,
    details,
    timestamp: serverTimestamp(),
  });
}

// Usage examples:
// logAdminActivity(uid, 'create_product', 'products', productId, { description: 'Created product: Arduino Uno' });
// logAdminActivity(uid, 'update_order_status', 'orders', orderId, { before: 'processing', after: 'shipped', description: 'Updated order status' });
// logAdminActivity(uid, 'disable_user', 'users', userId, { description: 'Disabled customer account' });
```

---

*Document Version: 1.0*
*Created: January 2026*
*Last Updated: January 2026*
