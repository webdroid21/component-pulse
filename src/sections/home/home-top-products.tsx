'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { useProducts } from 'src/hooks/firebase';

import { ProductItemTop } from './product-item-top';
import { ProductItemHot } from './product-item-hot';

// ----------------------------------------------------------------------

export function HomeTopProducts() {
    const { products, loading } = useProducts({ limit: 7 });

    const largeProducts = products.slice(0, 3);
    const smallProducts = products.slice(3, 7);

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
                    Top products
                </Typography>

                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                    sx={{ mb: { xs: 3, md: 8 } }}
                >
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Skeleton variant="rounded" width="100%" sx={{ aspectRatio: '1/1' }} />
                                <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                                <Skeleton variant="text" width="50%" />
                            </Paper>
                        ))
                        : smallProducts.map((product) => (
                            <ProductItemHot key={product.id} product={product} />
                        ))}
                </Box>

                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                    }}
                >
                    {loading ? (
                        <Paper sx={{ p: 5, borderRadius: 2 }}>
                            <Skeleton variant="rounded" width="100%" sx={{ aspectRatio: '1/1' }} />
                            <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
                        </Paper>
                    ) : (
                        largeProducts[0] && (
                            <>
                                <ProductItemTop
                                    variant="large"
                                    product={largeProducts[0]}
                                    sx={{ display: { xs: 'none', md: 'block' } }}
                                />

                                <ProductItemTop product={largeProducts[0]} sx={{ display: { md: 'none' } }} />
                            </>
                        )
                    )}

                    <Box
                        gap={3}
                        display="grid"
                        gridTemplateRows={{
                            xs: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)',
                        }}
                    >
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <Paper key={i} sx={{ p: 5, display: 'flex', gap: 2, borderRadius: 2 }}>
                                    <Skeleton variant="rounded" width={128} sx={{ aspectRatio: '1/1' }} />
                                    <Box display="flex" flexDirection="column" gap={1} sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="40%" />
                                    </Box>
                                </Paper>
                            ))
                        ) : (
                            <>
                                {largeProducts[1] && <ProductItemTop product={largeProducts[1]} />}
                                {largeProducts[2] && <ProductItemTop product={largeProducts[2]} />}
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
