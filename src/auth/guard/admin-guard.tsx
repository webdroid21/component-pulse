'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const { user, authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      router.replace(paths.auth.firebase.signIn);
      return;
    }

    // If user is not an admin, redirect to customer account page
    if (!user?.isAdmin) {
      router.replace(paths.account.root);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, user]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
