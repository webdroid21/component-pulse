'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { FIRESTORE } from 'src/lib/firebase';



import { HtmlRenderer } from 'src/components/html-renderer';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import { TrainingModule } from 'src/types/training-module';

import { TrainingModuleHero } from '../training-module-hero';
import { TrainingModuleMaterials } from '../training-module-materials';
import { TrainingModuleCurriculum } from '../training-module-curriculum';

// ----------------------------------------------------------------------

export function TrainingModuleDetailsView({ id }: { id: string }) {
    const { authenticated } = useAuthContext();
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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!module) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>Module not found.</Box>
        );
    }

    const canAccessMaterials = module.visibility === 'public' || authenticated;

    return (
        <>
            <TrainingModuleHero module={module} />

            <Container sx={{ py: 8 }}>
                <CustomBreadcrumbs
                    links={[
                        { name: 'Home', href: paths.home },
                        { name: 'Training Modules', href: paths.trainingModules.root },
                        { name: module.title },
                    ]}
                    sx={{ mb: 5 }}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gap: 5,
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    }}
                >
                    {/* Main Content */}
                    <Box>
                        <Box
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: (theme) => theme.customShadows.card,
                            }}
                        >
                            <HtmlRenderer html={module.content} />
                        </Box>
                    </Box>

                    {/* Sidebar */}
                    <Box>
                        <Box sx={{ position: 'sticky', top: 100 }}>
                            <TrainingModuleCurriculum timeline={module.timeline} />
                            <TrainingModuleMaterials materials={module.materials} canAccess={canAccessMaterials} />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
