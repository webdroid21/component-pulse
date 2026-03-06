'use client';

import type { TrainingUpdateType } from 'src/lib/email';
import type { TrainingModule } from 'src/types/training-module';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { FIRESTORE } from 'src/lib/firebase';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TrainingModuleForm } from '../training-module-form';

// ----------------------------------------------------------------------

const UPDATE_TYPE_OPTIONS: { value: TrainingUpdateType; label: string }[] = [
    { value: 'launched', label: 'Module Launched' },
    { value: 'updated', label: 'Module Updated' },
    { value: 'coming_soon', label: 'Coming Soon Announcement' },
];

// ----------------------------------------------------------------------

export function TrainingModuleEditView({ id }: { id: string }) {
    const [module, setModule] = useState<TrainingModule | null>(null);
    const [loading, setLoading] = useState(true);

    // Subscriber blast state
    const [blastType, setBlastType] = useState<TrainingUpdateType>('launched');
    const [blasting, setBlasting] = useState(false);
    const [blastResult, setBlastResult] = useState<{ sent: number; total: number; failed: number } | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    const handleNotifySubscribers = async () => {
        if (!module) return;
        setBlasting(true);
        setBlastResult(null);

        try {
            const moduleUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/training-modules/${module.id}`;
            const res = await fetch('/api/training/send-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleId: module.id,
                    moduleTitle: module.title,
                    updateType: blastType,
                    moduleUrl,
                }),
            });
            const data = await res.json();
            setBlastResult({ sent: data.sent ?? 0, total: data.total ?? 0, failed: data.failed ?? 0 });
        } catch (err) {
            console.error('Failed to notify subscribers:', err);
        } finally {
            setBlasting(false);
            setSnackbarOpen(true);
        }
    };

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

            {/* Notify Subscribers Panel */}
            <Card sx={{ p: 3, mt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <Iconify icon="solar:bell-bing-bold-duotone" width={24} sx={{ color: 'warning.main' }} />
                    <Typography variant="h6">Notify Subscribers</Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Send an email update to everyone who clicked &quot;Notify Me&quot; on this module.
                    Select the type of update and click the button below.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <TextField
                        select
                        label="Update Type"
                        value={blastType}
                        onChange={(e) => setBlastType(e.target.value as TrainingUpdateType)}
                        sx={{ minWidth: 220 }}
                    >
                        {UPDATE_TYPE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="contained"
                        color="warning"
                        disabled={blasting}
                        startIcon={
                            blasting
                                ? <CircularProgress size={18} color="inherit" />
                                : <Iconify icon="solar:letter-bold" />
                        }
                        onClick={handleNotifySubscribers}
                    >
                        {blasting ? 'Sending...' : 'Notify Subscribers'}
                    </Button>
                </Stack>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={blastResult?.failed === 0 ? 'success' : blastResult?.sent === 0 ? 'info' : 'warning'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {blastResult
                        ? blastResult.total === 0
                            ? 'No subscribers found for this module.'
                            : `Notification sent to ${blastResult.sent} of ${blastResult.total} subscriber(s).${blastResult.failed > 0 ? ` ${blastResult.failed} failed.` : ''}`
                        : 'Something went wrong.'}
                </Alert>
            </Snackbar>
        </DashboardContent>
    );
}
