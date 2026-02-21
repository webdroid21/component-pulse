'use client';

import type { TrainingMaterial } from 'src/types/training-module';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fData } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    materials: TrainingMaterial[];
    canAccess: boolean;
};

export function TrainingModuleMaterials({ materials, canAccess }: Props) {
    const theme = useTheme();

    if (!materials || materials.length === 0) return null;

    return (
        <Card sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Course Materials
            </Typography>

            {!canAccess ? (
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                        textAlign: 'center',
                        border: `1px dashed ${theme.vars.palette.divider}`,
                    }}
                >
                    <Iconify
                        icon="solar:lock-password-bold-duotone"
                        width={40}
                        sx={{ color: 'text.disabled', mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Login Required
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        You need to be logged in to download these materials.
                    </Typography>
                    <Button variant="outlined" color="inherit">
                        Sign In Now
                    </Button>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {materials.map((file) => (
                        <Stack
                            key={file.id || file.url}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                border: `1px solid ${theme.vars.palette.divider}`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    bgcolor: 'background.neutral',
                                }}
                            >
                                <Iconify icon="solar:file-download-bold-duotone" width={24} sx={{ color: 'text.secondary' }} />
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {fData(file.size)}
                                </Typography>
                            </Box>

                            <Button
                                size="small"
                                variant="outlined"
                                component="a"
                                href={file.url}
                                target="_blank"
                                rel="noopener"
                                startIcon={<Iconify icon="mingcute:download-line" />}
                            >
                                Download
                            </Button>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Card>
    );
}
