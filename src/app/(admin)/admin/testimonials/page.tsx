import { CONFIG } from 'src/global-config';

import { AdminTestimonialsView } from 'src/sections/admin/testimonials/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Testimonials | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <AdminTestimonialsView />;
}
