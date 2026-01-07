import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { FirebaseResetPasswordView } from 'src/auth/view/firebase';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Reset password - ${CONFIG.appName}` };

export default function Page() {
  return <FirebaseResetPasswordView />;
}
