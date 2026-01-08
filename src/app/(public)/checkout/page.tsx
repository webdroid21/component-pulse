import type { Metadata } from 'next';

import { CheckoutView } from 'src/sections/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Checkout - ComponentPulse',
  description: 'Complete your purchase securely.',
};

export default function Page() {
  return <CheckoutView />;
}
