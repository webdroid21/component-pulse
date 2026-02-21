'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'minimal-shared/hooks';
import { useGetApprovedReviews } from 'src/hooks/firebase/use-reviews';

import { Iconify } from 'src/components/iconify';

import { ProductReviewItem } from './product-review-item';
import { ProductReviewForm } from './product-review-form';

// ----------------------------------------------------------------------

type Props = {
    productId: string;
};

export function ProductReviews({ productId }: Props) {
    const formOpen = useBoolean();
    const { reviews, loading } = useGetApprovedReviews(productId);

    const totalReviews = reviews.length;
    const ratingAverage = totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    // Calculate star distribution
    const ratings = [
        { value: '5 Stars', count: reviews.filter((r) => r.rating === 5).length },
        { value: '4 Stars', count: reviews.filter((r) => r.rating === 4).length },
        { value: '3 Stars', count: reviews.filter((r) => r.rating === 3).length },
        { value: '2 Stars', count: reviews.filter((r) => r.rating === 2).length },
        { value: '1 Star', count: reviews.filter((r) => r.rating === 1).length },
    ];

    return (
        <>
            <Stack
                spacing={3}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
            >
                {/* Summary side */}
                <Stack spacing={2} sx={{ width: { xs: 1, md: 320 }, flexShrink: 0 }}>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Rating value={ratingAverage} readOnly precision={0.1} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            ({totalReviews} reviews)
                        </Typography>
                    </Stack>

                    <Typography variant="h2">{ratingAverage.toFixed(1)}</Typography>

                    <Stack spacing={1.5}>
                        {ratings.map((rating) => {
                            const progressOption = totalReviews === 0 ? 0 : (rating.count / totalReviews) * 100;
                            return (
                                <Stack key={rating.value} direction="row" alignItems="center">
                                    <Typography variant="subtitle2" sx={{ width: 64 }}>
                                        {rating.value}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressOption}
                                        color="inherit"
                                        sx={{
                                            flexGrow: 1,
                                            mx: 2,
                                            height: 8,
                                            bgcolor: 'background.neutral',
                                            '& .MuiLinearProgress-bar': { bgcolor: 'text.primary' },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ width: 44, color: 'text.secondary', textAlign: 'right' }}>
                                        {rating.count}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Stack>

                    <Button
                        size="large"
                        color="inherit"
                        variant="contained"
                        onClick={formOpen.onTrue}
                        startIcon={<Iconify icon="solar:pen-bold" />}
                    >
                        Write a Review
                    </Button>
                </Stack>

                {/* List side */}
                <Box sx={{ flexGrow: 1, width: 1 }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loading reviews...</Typography>
                        </Box>
                    ) : totalReviews === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Iconify icon="solar:chat-round-dots-bold-duotone" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6">No reviews yet</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Be the first to review this product!
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={3}>
                            {reviews.map((review) => (
                                <ProductReviewItem key={review.id} review={review} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>

            <ProductReviewForm open={formOpen.value} onClose={formOpen.onFalse} productId={productId} />
        </>
    );
}
