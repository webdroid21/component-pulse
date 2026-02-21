import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountOrdersView } from 'src/sections/account/orders/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My Orders - ${CONFIG.appName}` };

export default function Page() {
  return <AccountOrdersView />;
}
