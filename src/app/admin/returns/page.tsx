import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ReturnsListView } from 'src/sections/admin/returns/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Returns - ${CONFIG.appName}` };

export default function Page() {
  return <ReturnsListView />;
}
