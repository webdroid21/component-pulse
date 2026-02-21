'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'minimal-shared/utils';

import { ProductCountdownBlock } from './product-countdown-block';

// ----------------------------------------------------------------------

export function HomeSpecialOffer() {
    const renderCountdown = (
        <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            sx={{
                p: 5,
                borderRadius: 2,
                textAlign: 'center',
                boxShadow: (theme) => theme.customShadows.z24,
            }}
        >
            <Typography variant="overline" sx={{ color: 'primary.main' }}>
                Bundle Deal
            </Typography>

            <Typography component="h6" variant="h5" sx={{ mt: 1, mb: 3 }}>
                Arduino Mega 2560 Starter Kit
            </Typography>

            <Box
                component="span"
                sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    typography: 'subtitle2',
                    border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                }}
            >
                Only $49.99
            </Box>

            <Divider sx={{ borderStyle: 'dashed', my: 3, width: 1 }} />

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Deal ends in:
            </Typography>

            <ProductCountdownBlock
                expired={new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)} // 2 days from now
                slotProps={{
                    value: {
                        color: 'text.primary',
                        bgcolor: 'transparent',
                        border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                    },
                }}
            />
        </Box>
    );

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 5, md: 8 },
                bgcolor: 'background.default',
            }}
        >
            <Container>
                <Typography
                    variant="h3"
                    sx={{
                        mb: { xs: 5, md: 8 },
                        textAlign: { xs: 'center', md: 'unset' },
                    }}
                >
                    Special offer
                </Typography>

                <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        {renderCountdown}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            component="img"
                            alt="Arduino Mega Kit"
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                            sx={{
                                width: 1,
                                aspectRatio: '1/1',
                                borderRadius: 1.5,
                                bgcolor: 'background.neutral',
                                objectFit: 'cover'
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography component="h6" variant="h4" sx={{ mb: 1 }}>
                            Arduino Mega 2560 Starter Kit
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
                            The ultimate starting point for any electronics enthusiast. Includes the powerful Mega 2560 R3 board, breadboard, LCD, motors, sensors, and over 200 components. Perfect for massive automation tasks.
                        </Typography>

                        <Button
                            component={RouterLink}
                            href={paths.products}
                            size="large"
                            color="inherit"
                            variant="contained"
                        >
                            Shop Now
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
