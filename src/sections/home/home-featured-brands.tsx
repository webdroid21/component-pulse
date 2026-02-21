'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProducts } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';

import { ProductItemFeaturedByBrand } from './product-item-featured-by-brand';

// ----------------------------------------------------------------------

export function HomeFeaturedBrands() {
    const { products, loading } = useProducts({ limit: 4 });

    const renderBrandBox = (
        <Paper
            variant="outlined"
            sx={{
                p: 5,
                minHeight: 1,
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Iconify width={48} icon="fontisto:raspberry-pi" sx={{ color: '#C51A4A' }} />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Raspberry Pi Foundation
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                The trusted standard for robust, affordable microcomputing. Perfect for automation, smart homes, and edge computing.
            </Typography>

            <Button
                component={RouterLink}
                href={paths.products}
                color="inherit"
                endIcon={<Iconify width={16} icon="solar:alt-arrow-right-outline" sx={{ ml: -0.5 }} />}
                sx={{ mt: 5 }}
            >
                More details
            </Button>
        </Paper>
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
                    Featured brands
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        {renderBrandBox}
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box
                            gap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <Paper key={i} variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, borderRadius: 2 }}>
                                        <Skeleton variant="rounded" width={128} height={128} />
                                        <Box sx={{ flex: 1 }}>
                                            <Skeleton variant="text" width="80%" />
                                            <Skeleton variant="text" width="60%" />
                                            <Skeleton variant="text" width="40%" sx={{ mt: 2 }} />
                                        </Box>
                                    </Paper>
                                ))
                                : products.map((product) => (
                                    <ProductItemFeaturedByBrand key={product.id} product={product} />
                                ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
