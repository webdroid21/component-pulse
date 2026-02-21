import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ProductCreateView } from 'src/sections/admin/products/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create Product - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}
