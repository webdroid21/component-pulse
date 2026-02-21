import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountOrderDetailView } from 'src/sections/account/orders/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Order Details - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AccountOrderDetailView orderId={id} />;
}
