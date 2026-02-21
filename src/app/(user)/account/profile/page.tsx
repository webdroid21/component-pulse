import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountProfileView } from 'src/sections/account/profile/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My Profile - ${CONFIG.appName}` };

export default function Page() {
  return <AccountProfileView />;
}
