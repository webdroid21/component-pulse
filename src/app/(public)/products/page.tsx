import type { Metadata } from 'next';

import { ProductShopView } from 'src/sections/shop/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Shop - ComponentPulse',
  description: 'Browse our wide range of electronic components, solar panels, inverters, and batteries.',
};

export default function Page() {
  return <ProductShopView />;
}
