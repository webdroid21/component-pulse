import type { Theme, SxProps } from '@mui/material/styles';
import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

type Props = {
    sx?: SxProps<Theme>;
    isHot?: boolean;
    product: Product;
};

export function ProductItemHot({ product, isHot = false, sx }: Props) {
    const checkout = useCheckoutContext();

    const handleAddCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the product page
        e.stopPropagation();

        checkout.onAddToCart({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            coverUrl: product.images?.[0]?.url || '/assets/placeholder.svg',
            available: product.stock,
            quantity: 1,
        });
        toast.success('Added to cart');
    };

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

                <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" noWrap sx={{ mb: 0.5, fontWeight: 'fontWeightMedium' }}>
                        {product.name}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ ...(isHot && { color: 'error.main' }) }}
                        >
                            {fCurrency(product.salePrice || product.price)}
                        </Typography>

                        {(product.compareAtPrice || (isHot && product.price)) && (
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                            >
                                {fCurrency(product.compareAtPrice || (isHot ? product.price + 15000 : product.price))}
                            </Typography>
                        )}
                    </Stack>

                    <Box sx={{ mt: 'auto' }}>
                        <Button
                            fullWidth
                            size="small"
                            variant="soft"
                            color="inherit"
                            startIcon={<Iconify icon="solar:cart-plus-bold" />}
                            onClick={handleAddCart}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Link>
    );
}
