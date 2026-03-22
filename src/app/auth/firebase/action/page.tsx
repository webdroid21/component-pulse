import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { FirebaseAuthActionView } from 'src/auth/view/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Authentication Action - ${CONFIG.appName}` };

export default function Page() {
  return <FirebaseAuthActionView />;
}
