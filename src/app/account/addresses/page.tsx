import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountAddressesView } from 'src/sections/account/addresses/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My Addresses - ${CONFIG.appName}` };

export default function Page() {
  return <AccountAddressesView />;
}
