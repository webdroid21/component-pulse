import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { FirebaseSignInView } from 'src/auth/view/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in - ${CONFIG.appName}` };

export default function Page() {
  return <FirebaseSignInView />;
}
