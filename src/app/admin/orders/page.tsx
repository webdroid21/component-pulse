import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OrderListView } from 'src/sections/admin/orders/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Orders - ${CONFIG.appName}` };

export default function Page() {
  return <OrderListView />;
}
