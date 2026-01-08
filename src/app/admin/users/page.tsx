import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AdminUsersListView } from 'src/sections/admin/users/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Admin Users - ${CONFIG.appName}` };

export default function Page() {
  return <AdminUsersListView />;
}
