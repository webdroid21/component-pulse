'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useTrainingModules, useTrainingModuleMutations } from 'src/hooks/firebase/use-training-modules';

// ----------------------------------------------------------------------

export function TrainingModuleListView() {
    const { modules, loading } = useTrainingModules();
    const { deleteModule, loading: mutating } = useTrainingModuleMutations();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteModule(deleteId);
        setDeleteId(null);
    };

    return (
        <DashboardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                <Box>
                    <Typography variant="h4">Training Modules</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Manage your courses, materials, and training content
                    </Typography>
                </Box>
                <Button
                    component={RouterLink}
                    href={paths.admin.trainingModules.new}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    New Module
                </Button>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Module</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Visibility</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : modules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No training modules found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                modules.map((module) => (
                                    <TableRow key={module.id} hover>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar
                                                    alt={module.title}
                                                    src={module.coverImage}
                                                    variant="rounded"
                                                    sx={{ width: 64, height: 64 }}
                                                />
                                                <Stack>
                                                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
                                                        {module.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {module.duration} • {module.materials?.length || 0} material(s)
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            {module.isFree ? (
                                                <Label color="success">Free</Label>
                                            ) : (
                                                <Typography variant="subtitle2">
                                                    {fCurrency(module.price)}
                                                    {module.discount > 0 && (
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            sx={{
                                                                ml: 1,
                                                                color: 'text.disabled',
                                                                textDecoration: 'line-through',
                                                            }}
                                                        >
                                                            {fCurrency(module.price + module.discount)}
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Label
                                                variant="soft"
                                                color={module.visibility === 'public' ? 'info' : 'warning'}
                                            >
                                                {module.visibility === 'public' ? 'Public' : 'Logged In Only'}
                                            </Label>
                                        </TableCell>

                                        <TableCell>
                                            <Label
                                                variant="soft"
                                                color={
                                                    (module.status === 'active' && 'success') ||
                                                    (module.status === 'coming_soon' && 'info') ||
                                                    'default'
                                                }
                                            >
                                                {module.status}
                                            </Label>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack direction="row" justifyContent="flex-end">
                                                <IconButton
                                                    component={RouterLink}
                                                    href={paths.admin.trainingModules.edit(module.id)}
                                                >
                                                    <Iconify icon="solar:pen-bold" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeleteId(module.id)}
                                                >
                                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Module"
                content="Are you sure you want to delete this training module? This action cannot be undone."
                action={
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
                        Delete
                    </Button>
                }
            />
        </DashboardContent>
    );
}
