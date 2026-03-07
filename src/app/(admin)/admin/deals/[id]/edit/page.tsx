import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealEditView } from 'src/sections/admin/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit deal - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <DealEditView id={params.id} />;
}
