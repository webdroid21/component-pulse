import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'ComponentPulse - Quality Electronic Components & Solar Solutions in Uganda',
  description:
    'Your trusted source for solar panels, inverters, batteries, and electrical components. Fast delivery across Uganda with competitive prices.',
};

export default function Page() {
  return <HomeView />;
}
