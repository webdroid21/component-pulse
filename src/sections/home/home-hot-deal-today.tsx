'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useProducts } from 'src/hooks/firebase';

import {
    Carousel,
    useCarousel,
    CarouselDotButtons,
    CarouselArrowBasicButtons,
} from 'src/components/carousel';

import { ProductItemHot } from './product-item-hot';
import { ProductCountdownBlock } from './product-countdown-block';

// ----------------------------------------------------------------------

export function HomeHotDealToday() {
    const { products, loading } = useProducts({ isFeatured: true, limit: 8 });

    const carousel = useCarousel({
        slidesToShow: { xs: 2, sm: 3, md: 4, lg: 6 },
        slidesToScroll: 2,
        slideSpacing: '24px',
    });

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 5, md: 8 },
            }}
        >
            <Container>
                <Box
                    gap={3}
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    sx={{ mb: { xs: 5, md: 8 } }}
                >
                    <Typography variant="h3" sx={{ textAlign: { xs: 'center', md: 'unset' } }}>
                        🔥 Hot deal today
                    </Typography>

                    <ProductCountdownBlock
                        hideDays
                        labelPlacement="inline"
                        expired={new Date(Date.now() + 60 * 60 * 1000 * 1.5)} // 1.5 hours from now
                        width={44}
                        height={32}
                        slotProps={{
                            value: { bgcolor: 'text.primary', color: 'background.paper' },
                        }}
                    />

                    <Box flexGrow={1} />

                    <CarouselArrowBasicButtons
                        {...carousel.arrows}
                        options={carousel.options}
                        sx={{
                            gap: 1,
                            display: { xs: 'none', md: 'inline-flex' },
                        }}
                    />
                </Box>

                {loading ? (
                    <Box display="flex" gap={3}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Box key={i} sx={{ width: 180, flexShrink: 0 }}>
                                <Skeleton variant="rectangular" sx={{ width: 1, aspectRatio: '1/1', borderRadius: 1.5 }} />
                                <Skeleton variant="text" sx={{ width: 1, mt: 1 }} />
                                <Skeleton variant="text" sx={{ width: 0.5, mt: 0.5 }} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Carousel carousel={carousel}>
                        {products.map((product) => (
                            <ProductItemHot key={product.id} product={product} isHot />
                        ))}
                    </Carousel>
                )}

                <CarouselDotButtons
                    scrollSnaps={carousel.dots.scrollSnaps}
                    selectedIndex={carousel.dots.selectedIndex}
                    onClickDot={carousel.dots.onClickDot}
                    sx={{
                        mt: 8,
                        width: 1,
                        color: 'primary.main',
                        justifyContent: 'center',
                        display: { xs: 'inline-flex', md: 'none' },
                    }}
                />
            </Container>
        </Box>
    );
}
