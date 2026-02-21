import { CONFIG } from 'src/global-config';

import { TrainingModuleCreateView } from 'src/sections/admin/training-modules/view/training-module-create-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create Training Module | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <TrainingModuleCreateView />;
}
