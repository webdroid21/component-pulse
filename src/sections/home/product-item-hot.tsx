import type { Theme, SxProps } from '@mui/material/styles';
import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
    sx?: SxProps<Theme>;
    isHot?: boolean;
    product: Product;
};

export function ProductItemHot({ product, isHot = false, sx }: Props) {
    const stock = product.stock || 100;
    const sold = isHot ? Math.floor(stock * 0.7) : 0; // fallback mock for showcase

    return (
        <Link component={RouterLink} href={paths.product(product.slug || product.id)} color="inherit" underline="none">
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'transparent',
                    transition: (theme) =>
                        theme.transitions.create('background-color', {
                            easing: theme.transitions.easing.easeIn,
                            duration: theme.transitions.duration.shortest,
                        }),
                    '&:hover': {
                        bgcolor: 'background.neutral',
                    },
                    ...sx,
                }}
            >
                <Box
                    component="img"
                    alt={product.name}
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
                    sx={{ mb: 2, borderRadius: 1.5, bgcolor: 'background.neutral', width: 1, aspectRatio: '1/1', objectFit: 'cover' }}
                />

                <div>
                    <Typography variant="body2" noWrap sx={{ mb: 0.5, fontWeight: 'fontWeightMedium' }}>
                        {product.name}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{ ...(isHot && { color: 'error.main' }) }}
                    >
                        {fCurrency(product.salePrice || product.price)}
                    </Typography>
                </div>

                {isHot && (
                    <Box gap={1} display="flex" alignItems="center" sx={{ mt: 1 }}>
                        <LinearProgress
                            color="inherit"
                            variant="determinate"
                            value={(sold / stock) * 100}
                            sx={{ flex: '1 1 auto' }}
                        />

                        <Typography
                            variant="caption"
                            sx={{ flexShrink: 0, color: 'text.disabled' }}
                        >{`🔥 ${sold} sold`}</Typography>
                    </Box>
                )}
            </Paper>
        </Link>
    );
}
