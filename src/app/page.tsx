import type { Metadata } from 'next';

import { MainLayout } from 'src/layouts/main';

import { HomeView } from 'src/sections/home/view';
import { CheckoutProvider } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'ComponentPulse - Quality Electronic Components, Wires & Fuses',
  description:
    'Your trusted source for electrical components, wires, fuses, connectors, and tools. Fast delivery across Uganda with competitive prices.',
};

export default function Page() {
  return (
    <CheckoutProvider>
      <MainLayout>
        <HomeView />
      </MainLayout>
    </CheckoutProvider>
  );
}
