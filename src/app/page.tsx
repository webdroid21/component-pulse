'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the public home page
    router.replace('/home');
  }, [router]);

  return null;
}
