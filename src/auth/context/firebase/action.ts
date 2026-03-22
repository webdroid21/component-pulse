'use client';

import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp, query, limit } from 'firebase/firestore';
import {
  signOut as _signOut,
  signInWithPopup as _signInWithPopup,
  GoogleAuthProvider as _GoogleAuthProvider,
  sendEmailVerification as _sendEmailVerification,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
} from 'firebase/auth';

import { AUTH, FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type ForgotPasswordParams = {
  email: string;
};

// ----------------------------------------------------------------------

/**
 * Check if this is the first user in the system (for dev mode - first user becomes super admin)
 * Only returns true if there are NO admins in the system
 */
async function isFirstUser(): Promise<boolean> {
  try {
    const q = query(collection(FIRESTORE, 'admins'), limit(1));
    const adminsSnapshot = await getDocs(q);
    // Only check admins collection - if any admin exists, new users should be customers
    return adminsSnapshot.empty;
  } catch (error) {
    console.error('Error checking first user:', error);
    // On error, default to customer to be safe
    return false;
  }
}

/**
 * Check if user is an admin
 */
export async function checkIsAdmin(uid: string): Promise<{
  isAdmin: boolean;
  role?: 'super_admin' | 'admin' | 'staff';
  adminData?: any;
}> {
  try {
    const adminDoc = await getDoc(doc(FIRESTORE, 'admins', uid));
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      return {
        isAdmin: true,
        role: adminData.role,
        adminData,
      };
    }
    return { isAdmin: false };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
}

/**
 * Get user profile data
 */
export async function getUserProfile(uid: string): Promise<any> {
  try {
    const userDoc = await getDoc(doc(FIRESTORE, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/** **************************************
 * Sign in with email/password
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    await _signInWithEmailAndPassword(AUTH, email, password);

    const user = AUTH.currentUser;

    if (!user?.emailVerified) {
      throw new Error('Email not verified! Please check your inbox.');
    }
  } catch (error) {
    console.error('Error during sign in with password:', error);
    throw error;
  }
};

/** **************************************
 * Sign in with Google
 *************************************** */
export const signInWithGoogle = async (): Promise<void> => {
  try {
    const provider = new _GoogleAuthProvider();
    const result = await _signInWithPopup(AUTH, provider);
    const { user: googleUser } = result;

    // Check if user document exists
    const userDoc = await getDoc(doc(FIRESTORE, 'users', googleUser.uid));

    if (!userDoc.exists()) {
      // Check if this is the first user (becomes super admin in dev mode)
      const firstUser = await isFirstUser();

      if (firstUser) {
        // Create as super admin
        await setDoc(doc(FIRESTORE, 'admins', googleUser.uid), {
          uid: googleUser.uid,
          email: googleUser.email,
          displayName: googleUser.displayName || '',
          photoURL: googleUser.photoURL || '',
          role: 'super_admin',
          permissions: [],
          isActive: true,
          createdBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        console.log('First user created as Super Admin');
      } else {
        // Create new customer user document
        await setDoc(doc(FIRESTORE, 'users', googleUser.uid), {
          uid: googleUser.uid,
          email: googleUser.email,
          displayName: googleUser.displayName || '',
          firstName: googleUser.displayName?.split(' ')[0] || '',
          lastName: googleUser.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: googleUser.photoURL || '',
          phone: '',
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

      // Trigger Welcome Email
      try {
        await fetch('/api/auth/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleUser.email,
            firstName: googleUser.displayName?.split(' ')[0] || '',
          }),
        });
      } catch (emailErr) {
        console.error('Failed to dispatch welcome email:', emailErr);
      }

    } else {
      // Update last login
      await setDoc(
        doc(FIRESTORE, 'users', googleUser.uid),
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      );
    }

    // Trigger Login Alert Email
    try {
      await fetch('/api/auth/login-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          firstName: googleUser.displayName?.split(' ')[0] || '',
          time: new Date().toLocaleString(),
          device: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
        }),
      });
    } catch (alertErr) {
      console.error('Failed to dispatch login alert:', alertErr);
    }

  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up with email/password
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  phone,
}: SignUpParams): Promise<void> => {
  try {
    const newUser = await _createUserWithEmailAndPassword(AUTH, email, password);

    // Check if this is the first user (becomes super admin in dev mode)
    const firstUser = await isFirstUser();

    if (firstUser) {
      // Create as super admin
      await setDoc(doc(FIRESTORE, 'admins', newUser.user.uid), {
        uid: newUser.user.uid,
        email,
        displayName: `${firstName} ${lastName}`,
        phone: phone || '',
        role: 'super_admin',
        permissions: [],
        isActive: true,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: null,
      });
      console.log('First user created as Super Admin');
    } else {
      // Create customer user document
      await setDoc(doc(FIRESTORE, 'users', newUser.user.uid), {
        uid: newUser.user.uid,
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone: phone || '',
        photoURL: '',
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
        lastLoginAt: null,
      });
    }

    // Send custom verification email with fallback
    try {
      const resp = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });
      if (!resp.ok) throw new Error('API config missing');
    } catch (apiErr) {
      console.warn('Falling back to default Firebase Auth templates (add FIREBASE_ADMIN keys to remove this)');
      await _sendEmailVerification(newUser.user);
    }

    // Trigger Welcome Email
    try {
      await fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
        }),
      });
    } catch (emailErr) {
      console.error('Failed to dispatch welcome email:', emailErr);
    }
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  await _signOut(AUTH);
};

/** **************************************
 * Reset password
 *************************************** */
export const sendPasswordResetEmail = async ({ email }: ForgotPasswordParams): Promise<void> => {
  try {
    const resp = await fetch('/api/auth/send-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) throw new Error('API config missing');
  } catch (apiErr) {
    console.warn('Falling back to default Firebase Auth templates');
    await _sendPasswordResetEmail(AUTH, email);
  }
};

/** **************************************
 * Resend verification email
 *************************************** */
export const resendVerificationEmail = async (): Promise<void> => {
  const user = AUTH.currentUser;
  if (user) {
    try {
      const resp = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      if (!resp.ok) throw new Error('API config missing');
    } catch (apiErr) {
      console.warn('Falling back to default Firebase Auth templates');
      await _sendEmailVerification(user);
    }
  } else {
    throw new Error('No user is currently signed in');
  }
};
