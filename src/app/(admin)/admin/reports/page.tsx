import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ReportsView } from 'src/sections/admin/reports/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Reports - ${CONFIG.appName}` };

export default function Page() {
  return <ReportsView />;
}
