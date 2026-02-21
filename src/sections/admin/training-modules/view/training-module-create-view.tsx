'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TrainingModuleForm } from '../training-module-form';

// ----------------------------------------------------------------------

export function TrainingModuleCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new training module"
                links={[
                    { name: 'Dashboard', href: paths.admin.root },
                    { name: 'Training Modules', href: paths.admin.trainingModules.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <TrainingModuleForm />
        </DashboardContent>
    );
}
