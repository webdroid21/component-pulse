import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DeliveryZonesView } from 'src/sections/admin/delivery/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Delivery Zones - ${CONFIG.appName}` };

export default function Page() {
  return <DeliveryZonesView />;
}
