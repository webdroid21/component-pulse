import { TrainingModuleDetailsView } from 'src/sections/training-modules/view/training-module-details-view';

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Training Module Details | ComponentPulse',
};

type Props = {
    params: Promise<{ id: string }>;
};

export default async function TrainingModuleDetailsPage({ params }: Props) {
    const { id } = await params;
    return <TrainingModuleDetailsView id={id} />;
}
