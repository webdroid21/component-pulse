import type { Metadata } from 'next';

import { CartView } from 'src/sections/cart/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Shopping Cart - ComponentPulse',
  description: 'Review your shopping cart and proceed to checkout.',
};

export default function Page() {
  return <CartView />;
}
