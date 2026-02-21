import { CONFIG } from 'src/global-config';

import { TrainingModuleEditView } from 'src/sections/admin/training-modules/view/training-module-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit Training Module | Dashboard - ${CONFIG.appName}` };

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <TrainingModuleEditView id={id} />;
}
