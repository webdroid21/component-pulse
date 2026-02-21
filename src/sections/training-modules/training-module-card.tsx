'use client';

import type { TrainingModule } from 'src/types/training-module';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    module: TrainingModule;
};

export function TrainingModuleCard({ module }: Props) {
    const theme = useTheme();

    const isComingSoon = module.status === 'coming_soon';

    const linkTo = paths.trainingModules.details(module.id);

    return (
        <Card
            component={RouterLink}
            href={linkTo}
            sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                height: 1,
                transition: theme.transitions.create('all'),
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows.z24,
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                {isComingSoon && (
                    <Label
                        variant="filled"
                        color="info"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 9,
                            textTransform: 'uppercase',
                        }}
                    >
                        Coming Soon
                    </Label>
                )}

                {module.isFree && !isComingSoon && (
                    <Label
                        variant="filled"
                        color="success"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 9,
                            textTransform: 'uppercase',
                        }}
                    >
                        Free
                    </Label>
                )}

                <Box
                    component="img"
                    alt={module.title}
                    src={module.coverImage || '/assets/illustrations/illustration-seo.svg'}
                    sx={{
                        width: 1,
                        height: 'auto',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        ...(isComingSoon && {
                            filter: 'grayscale(1)',
                            opacity: 0.8,
                        }),
                    }}
                />
            </Box>

            <Stack spacing={2} sx={{ p: 3, pt: 2, flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ height: 44, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {module.title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', typography: 'caption' }}>
                    <Iconify icon="solar:clock-circle-linear" width={16} />
                    {module.duration || 'Flexible duration'}
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(module.topics || []).slice(0, 3).map((topic) => (
                        <Label key={topic} variant="soft" color="default" sx={{ typography: 'caption' }}>
                            {topic}
                        </Label>
                    ))}
                    {(module.topics?.length || 0) > 3 && (
                        <Label variant="soft" color="default" sx={{ typography: 'caption' }}>
                            +{module.topics.length - 3}
                        </Label>
                    )}
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">
                        {module.isFree ? (
                            <Box component="span" sx={{ color: 'success.main' }}>Free</Box>
                        ) : (
                            <>
                                {module.discount > 0 && (
                                    <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5, typography: 'body2' }}>
                                        {fCurrency(module.price + module.discount)}
                                    </Box>
                                )}
                                <Box component="span">{fCurrency(module.price)}</Box>
                            </>
                        )}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', typography: 'caption' }}>
                        <Iconify icon="solar:file-text-bold-duotone" width={16} />
                        {module.materials?.length || 0}
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
