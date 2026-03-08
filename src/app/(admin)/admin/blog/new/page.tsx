import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { BlogCreateView } from 'src/sections/admin/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new post - ${CONFIG.appName}` };

export default function Page() {
  return <BlogCreateView />;
}
