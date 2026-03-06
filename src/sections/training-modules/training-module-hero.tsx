'use client';

import type { TrainingModule } from 'src/types/training-module';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useTrainingSubscriptions } from 'src/hooks/firebase';

// ----------------------------------------------------------------------

type Props = {
    module: TrainingModule;
};

export function TrainingModuleHero({ module }: Props) {
    const theme = useTheme();
    const { isSubscribed, subscribe, loading, checking } = useTrainingSubscriptions(module.id);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleNotifyMe = async () => {
        if (isSubscribed) {
            setSnackbarMessage("You're already subscribed to updates for this module!");
            setSnackbarOpen(true);
            return;
        }
        const success = await subscribe();
        if (success) {
            setSnackbarMessage("You'll be notified when this module launches or is updated!");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.neutral',
                py: { xs: 5, md: 10 },
            }}
        >
            <Container>
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={5}
                >
                    {/* Content */}
                    <Stack spacing={3} sx={{ maxWidth: { md: 540 } }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {module.status === 'coming_soon' && (
                                <Label color="info" variant="filled">Coming Soon</Label>
                            )}
                            {module.visibility === 'logged_in' && (
                                <Label color="warning" variant="soft">Members Only</Label>
                            )}
                        </Box>

                        <Typography variant="h2">{module.title}</Typography>

                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {module.description}
                        </Typography>

                        <Stack direction="row" spacing={3} sx={{ color: 'text.secondary', typography: 'subtitle2' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="solar:clock-circle-bold-duotone" width={24} />
                                {module.duration || 'Self-paced'}
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="solar:file-text-bold-duotone" width={24} />
                                {module.materials?.length || 0} Materials
                            </Stack>
                        </Stack>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {module.topics?.map((topic) => (
                                <Label key={topic} variant="soft" color="default">
                                    {topic}
                                </Label>
                            ))}
                        </Box>

                        <Stack direction="row" alignItems="center" spacing={3} sx={{ pt: 3 }}>
                            {module.isFree ? (
                                <Typography variant="h3" sx={{ color: 'success.main' }}>Free</Typography>
                            ) : (
                                <Stack>
                                    {module.discount > 0 && (
                                        <Typography component="span" variant="subtitle2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                                            {fCurrency(module.price + module.discount)}
                                        </Typography>
                                    )}
                                    <Typography variant="h3">{fCurrency(module.price)}</Typography>
                                </Stack>
                            )}

                            {module.status === 'coming_soon' ? (
                                <Button
                                    size="large"
                                    variant={isSubscribed ? 'outlined' : 'contained'}
                                    color={isSubscribed ? 'success' : 'inherit'}
                                    disabled={checking || loading}
                                    startIcon={
                                        loading || checking
                                            ? <CircularProgress size={18} color="inherit" />
                                            : isSubscribed
                                                ? <Iconify icon="solar:check-circle-bold" />
                                                : <Iconify icon="solar:bell-bing-bold" />
                                    }
                                    onClick={handleNotifyMe}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Notify Me'}
                                </Button>
                            ) : (
                                <Button size="large" variant="contained" color="primary">
                                    {module.price > 0 && !module.isFree ? 'Purchase Module' : 'Start Learning'}
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    {/* Image */}
                    <Box
                        sx={{
                            width: 1,
                            maxWidth: { xs: 1, md: 500 },
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: theme.customShadows.z24,
                        }}
                    >
                        <Box
                            component="img"
                            alt={module.title}
                            src={module.coverImage || '/assets/illustrations/illustration-seo.svg'}
                            sx={{
                                width: 1,
                                height: 'auto',
                                aspectRatio: '4/3',
                                objectFit: 'cover',
                                ...(module.status === 'coming_soon' && {
                                    filter: 'grayscale(1)',
                                }),
                            }}
                        />
                    </Box>
                </Stack>
            </Container>

            {/* Subscription success snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={isSubscribed ? 'success' : 'info'}
                    variant="filled"
                    sx={{ width: '100%' }}
                    icon={<Iconify icon="solar:bell-bing-bold" />}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
