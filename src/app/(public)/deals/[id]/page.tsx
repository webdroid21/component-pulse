import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealDetailsView } from 'src/sections/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Deal Details | ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <DealDetailsView id={id} />;
}
