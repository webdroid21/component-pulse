'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';



import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useTrainingModules } from 'src/hooks/firebase/use-training-modules';

import { TrainingModuleCard } from '../training-module-card';
import { EmbeddedSystemsHero } from '../embedded-systems-hero';
import { EmbeddedSystemsFeatures } from '../embedded-systems-features';

// ----------------------------------------------------------------------

export function TrainingModuleListView() {
    // Only fetch active or coming_soon modules
    const { modules, loading } = useTrainingModules(true);

    return (
        <>
            <EmbeddedSystemsHero />

            <EmbeddedSystemsFeatures />

            <Container sx={{ mb: 10 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : modules.length === 0 ? (
                    <EmptyContent
                        filled
                        title="No training modules available right now"
                        description="Check back later for new content."
                        sx={{ py: 10 }}
                    />
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: {
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                        }}
                    >
                        {modules.map((module) => (
                            <TrainingModuleCard key={module.id} module={module} />
                        ))}
                    </Box>
                )}
            </Container>
        </>
    );
}
