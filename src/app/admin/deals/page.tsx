import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealsListView } from 'src/sections/admin/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Deals - ${CONFIG.appName}` };

export default function Page() {
  return <DealsListView />;
}
