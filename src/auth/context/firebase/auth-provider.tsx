'use client';

import type { AuthState } from '../../types';

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { AUTH, FIRESTORE } from 'src/lib/firebase';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      onAuthStateChanged(AUTH, async (user: AuthState['user']) => {
        if (user) {
          // First check if user is an admin
          const adminDoc = await getDoc(doc(FIRESTORE, 'admins', user.uid));

          if (adminDoc.exists()) {
            const adminData = adminDoc.data();

            // Check if admin is active
            if (!adminData.isActive) {
              setState({ user: null, loading: false });
              return;
            }

            // Update last login
            await setDoc(
              doc(FIRESTORE, 'admins', user.uid),
              { lastLoginAt: serverTimestamp() },
              { merge: true }
            );

            setState({
              user: {
                ...user,
                ...adminData,
                isAdmin: true,
                userType: 'admin',
              },
              loading: false,
            });
            return;
          }

          // Check if regular user (customer)
          // For email/password users, require email verification
          if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
            setState({ user: null, loading: false });
            return;
          }

          const userDoc = await getDoc(doc(FIRESTORE, 'users', user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check if user is active
            if (!userData.isActive) {
              setState({ user: null, loading: false });
              return;
            }

            // Update last login
            await setDoc(
              doc(FIRESTORE, 'users', user.uid),
              { lastLoginAt: serverTimestamp() },
              { merge: true }
            );

            setState({
              user: {
                ...user,
                ...userData,
                isAdmin: false,
                userType: 'customer',
              },
              loading: false,
            });
          } else {
            // User exists in Auth but not in Firestore (edge case)
            setState({ user: { ...user, isAdmin: false, userType: 'customer' }, loading: false });
          }
        } else {
          setState({ user: null, loading: false });
        }
      });
    } catch (error) {
      console.error('Error checking user session:', error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.uid,
            accessToken: state.user?.accessToken,
            displayName: state.user?.displayName,
            photoURL: state.user?.photoURL,
            email: state.user?.email,
            role: state.user?.role ?? null,
            isAdmin: state.user?.isAdmin ?? false,
            userType: state.user?.userType ?? 'customer',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
