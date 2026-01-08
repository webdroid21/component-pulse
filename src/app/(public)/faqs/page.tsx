import type { Metadata } from 'next';

import { FaqsView } from 'src/sections/faqs/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'FAQs - ComponentPulse',
  description: 'Frequently asked questions about ComponentPulse products, shipping, and services.',
};

export default function Page() {
  return <FaqsView />;
}
