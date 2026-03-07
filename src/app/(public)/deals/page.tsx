import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealsView } from 'src/sections/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Combo Deals | ${CONFIG.appName}` };

export default function Page() {
  return <DealsView />;
}
