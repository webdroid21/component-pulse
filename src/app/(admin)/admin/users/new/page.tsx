import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AdminUserCreateView } from 'src/sections/admin/users/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create Admin User - ${CONFIG.appName}` };

export default function Page() {
  return <AdminUserCreateView />;
}
