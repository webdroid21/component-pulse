import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ProductListView } from 'src/sections/admin/products/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Products - ${CONFIG.appName}` };

export default function Page() {
  return <ProductListView />;
}
