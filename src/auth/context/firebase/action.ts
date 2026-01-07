'use client';

import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
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
 */
async function isFirstUser(): Promise<boolean> {
  try {
    const adminsSnapshot = await getDocs(collection(FIRESTORE, 'admins'));
    const usersSnapshot = await getDocs(collection(FIRESTORE, 'users'));
    return adminsSnapshot.empty && usersSnapshot.empty;
  } catch (error) {
    console.error('Error checking first user:', error);
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
    } else {
      // Update last login
      await setDoc(
        doc(FIRESTORE, 'users', googleUser.uid),
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      );
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

    // Send verification email
    await _sendEmailVerification(newUser.user);

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
  await _sendPasswordResetEmail(AUTH, email);
};

/** **************************************
 * Resend verification email
 *************************************** */
export const resendVerificationEmail = async (): Promise<void> => {
  const user = AUTH.currentUser;
  if (user) {
    await _sendEmailVerification(user);
  } else {
    throw new Error('No user is currently signed in');
  }
};
