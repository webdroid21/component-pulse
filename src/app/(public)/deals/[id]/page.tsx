import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealDetailsView } from 'src/sections/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Deal Details | ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <DealDetailsView id={params.id} />;
}
