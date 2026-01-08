import type { Metadata } from 'next';

import { MainLayout } from 'src/layouts/main';

import { HomeView } from 'src/sections/home/view';
import { CheckoutProvider } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'ComponentPulse - Quality Electronic Components & Solar Solutions in Uganda',
  description:
    'Your trusted source for solar panels, inverters, batteries, and electrical components. Fast delivery across Uganda with competitive prices.',
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
