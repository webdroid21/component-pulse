import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { BlogEditView } from 'src/sections/admin/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit post - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <BlogEditView id={id} />;
}
