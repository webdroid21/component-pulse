import type { Metadata } from 'next';

import { AboutView } from 'src/sections/about/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'About Us - ComponentPulse',
  description: 'Learn about ComponentPulse, Uganda\'s leading supplier of electronic components and solar solutions.',
};

export default function Page() {
  return <AboutView />;
}
