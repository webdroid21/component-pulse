import { CONFIG } from 'src/global-config';

import { TrainingModuleListView } from 'src/sections/admin/training-modules/view/training-module-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Training Modules | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <TrainingModuleListView />;
}
