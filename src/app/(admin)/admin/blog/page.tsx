import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { BlogListView } from 'src/sections/admin/blog/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Blog Posts - ${CONFIG.appName}` };

export default function Page() {
  return <BlogListView />;
}
