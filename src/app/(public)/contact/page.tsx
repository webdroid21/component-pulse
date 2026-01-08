import type { Metadata } from 'next';

import { ContactView } from 'src/sections/contact/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Contact Us - ComponentPulse',
  description: 'Get in touch with ComponentPulse. We\'re here to help with your electronic and solar needs.',
};

export default function Page() {
  return <ContactView />;
}
