import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { PostDetailsHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Blog Post | ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PostDetailsHomeView id={id} />;
}
