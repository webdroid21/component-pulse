import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EmbeddedSystemsHero({ sx, ...other }: BoxProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                ...theme.mixins.bgGradient({
                    images: [
                        `linear-gradient(to bottom, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark})`,
                    ],
                }),
                py: { xs: 10, md: 15 },
                color: 'common.white',
                textAlign: 'center',
                ...sx,
            }}
            {...other}
        >
            <Container>
                <Typography variant="h1" sx={{ mb: 3 }}>
                    Embedded Systems Training
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        mb: 5,
                        mx: 'auto',
                        maxWidth: 720,
                        fontWeight: 'fontWeightRegular',
                        opacity: 0.8,
                    }}
                >
                    Master embedded systems development with hands-on training from industry experts.
                    Build real projects and gain practical skills that employers value.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        size="large"
                        variant="contained"
                        color="warning"
                        startIcon={<Iconify icon="solar:calendar-date-bold-duotone" />}
                    >
                        Get Notified When Available
                    </Button>

                    <Button
                        size="large"
                        variant="outlined"
                        color="inherit"
                        sx={{ borderColor: 'rgba(255,255,255,0.48)' }}
                    >
                        Download Curriculum
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
