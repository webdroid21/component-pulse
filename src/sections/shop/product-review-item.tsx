import type { ReviewItem } from 'src/hooks/firebase/use-reviews';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';


// ----------------------------------------------------------------------

type Props = {
    review: ReviewItem;
};

export function ProductReviewItem({ review }: Props) {
    return (
        <Card sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Stack
                    direction={{ xs: 'row', md: 'column' }}
                    alignItems="center"
                    sx={{
                        minWidth: { md: 160 },
                        textAlign: { md: 'center' },
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: 'background.neutral',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            typography: 'h6',
                            color: 'text.secondary',
                            mr: { xs: 2, md: 0 },
                            mb: { md: 2 },
                        }}
                    >
                        {review.name.charAt(0).toUpperCase()}
                    </Box>

                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" noWrap>
                            {review.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {review.createdAt ? fDate(review.createdAt.toDate()) : 'Recently'}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack spacing={1} flexGrow={1}>
                    <Rating size="small" value={review.rating} readOnly precision={0.5} />

                    {review.isApproved === false && (
                        <Typography variant="caption" sx={{ color: 'warning.main', fontStyle: 'italic' }}>
                            Your review is awaiting moderation.
                        </Typography>
                    )}

                    <Typography variant="body2">{review.message}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
