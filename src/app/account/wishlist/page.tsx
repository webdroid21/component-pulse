import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountWishlistView } from 'src/sections/account/wishlist/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My Wishlist - ${CONFIG.appName}` };

export default function Page() {
  return <AccountWishlistView />;
}
