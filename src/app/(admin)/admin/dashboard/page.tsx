import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AdminDashboardView } from 'src/sections/admin/dashboard/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AdminDashboardView />;
}
