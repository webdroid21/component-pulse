import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DealEditView } from 'src/sections/admin/deals/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit deal - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <DealEditView id={id} />;
}
