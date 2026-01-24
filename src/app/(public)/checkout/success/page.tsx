import type { Metadata } from 'next';

import { CheckoutSuccessView } from 'src/sections/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Order Confirmed - ComponentPulse',
  description: 'Your order has been successfully placed.',
};

export default function Page() {
  return <CheckoutSuccessView />;
}
