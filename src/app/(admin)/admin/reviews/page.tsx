import { CONFIG } from 'src/global-config';

import { AdminReviewsView } from 'src/sections/admin/reviews/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Reviews | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <AdminReviewsView />;
}
