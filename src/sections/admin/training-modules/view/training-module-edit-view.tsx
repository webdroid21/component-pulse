'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { FIRESTORE } from 'src/lib/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TrainingModule } from 'src/types/training-module';

import { TrainingModuleForm } from '../training-module-form';

// ----------------------------------------------------------------------

export function TrainingModuleEditView({ id }: { id: string }) {
    const [module, setModule] = useState<TrainingModule | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const docRef = doc(FIRESTORE, 'trainingModules', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setModule({ id: docSnap.id, ...docSnap.data() } as TrainingModule);
                }
            } catch (err) {
                console.error('Failed to fetch module', err);
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
    }, [id]);

    if (loading) {
        return (
            <DashboardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    if (!module) {
        return (
            <DashboardContent>
                <Box sx={{ p: 5 }}>Module not found.</Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Edit Training Module"
                links={[
                    { name: 'Dashboard', href: paths.admin.root },
                    { name: 'Training Modules', href: paths.admin.trainingModules.root },
                    { name: module?.title || 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <TrainingModuleForm currentModule={module} />
        </DashboardContent>
    );
}
