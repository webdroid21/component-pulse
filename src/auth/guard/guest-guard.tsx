'use client';

import { useState, useEffect } from 'react';
import { safeReturnUrl } from 'minimal-shared/utils';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const { user, loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const searchParams = useSearchParams();

  // Determine redirect based on user type (admin vs customer)
  const getRedirectPath = () => {
    if (user?.isAdmin) {
      return paths.admin.root;
    }
    return paths.account.root;
  };

  const defaultRedirect = getRedirectPath();
  const redirectUrl = safeReturnUrl(searchParams.get('returnTo'), defaultRedirect);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.replace(redirectUrl);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
