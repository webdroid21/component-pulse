'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useProducts } from 'src/hooks/firebase';

import { ProductItemBestSellers } from './product-item-best-sellers';

// ----------------------------------------------------------------------

const TABS = ['Featured', 'Top rated', 'Onsale'];

export function HomePopularProducts() {
    const [tab, setTab] = useState(TABS[0]);

    const { products, loading } = useProducts({ limit: 8 });

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    }, []);

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 5, md: 8 },
                bgcolor: 'background.neutral',
            }}
        >
            <Container>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: { xs: 'center', md: 'unset' },
                    }}
                >
                    Popular products
                </Typography>

                <Tabs
                    value={tab}
                    scrollButtons="auto"
                    variant="scrollable"
                    allowScrollButtonsMobile
                    onChange={handleChangeTab}
                    sx={{ my: 5 }}
                >
                    {TABS.map((category) => (
                        <Tab key={category} value={category} label={category} />
                    ))}
                </Tabs>

                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                >
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <Box key={i} display="flex" gap={2}>
                                <Skeleton variant="rounded" width={80} height={80} />
                                <Box display="flex" flexDirection="column" gap={1} sx={{ minWidth: 0, flex: 1 }}>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="50%" />
                                    <Skeleton variant="text" width="60%" />
                                </Box>
                            </Box>
                        ))
                        : products.map((product) => (
                            <ProductItemBestSellers key={product.id} product={product} />
                        ))}
                </Box>
            </Container>
        </Box>
    );
}
