import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealCreateView } from 'src/sections/admin/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new deal - ${CONFIG.appName}` };

export default function Page() {
  return <DealCreateView />;
}
