import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CouponsListView } from 'src/sections/admin/coupons/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Coupons - ${CONFIG.appName}` };

export default function Page() {
  return <CouponsListView />;
}
