import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CategoryListView } from 'src/sections/admin/categories/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Categories - ${CONFIG.appName}` };

export default function Page() {
  return <CategoryListView />;
}
