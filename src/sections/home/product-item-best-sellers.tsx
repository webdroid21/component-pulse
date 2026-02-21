import type { BoxProps } from '@mui/material/Box';
import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = BoxProps & {
    product: Product;
};

export function ProductItemBestSellers({ product, sx, ...other }: Props) {
    const stock = product.stock || 100;
    const sold = Math.floor(stock * 0.8);
    const ratingValue = 4.5; // Mock rating since schema lacks rating fields

    return (
        <Box gap={2} display="flex" sx={sx} {...other}>
            <Box
                component="img"
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
                sx={{
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    objectFit: 'cover',
                    bgcolor: 'background.neutral',
                }}
            />

            <Box gap={0.5} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
                <Link
                    component={RouterLink}
                    href={paths.product(product.slug || product.id)}
                    color="inherit"
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 'fontWeightMedium' }}
                >
                    {product.name}
                </Link>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating size="small" value={ratingValue} precision={0.5} readOnly />
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        ({sold} sold)
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {product.salePrice && product.salePrice < product.price ? (
                        <>
                            <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                                {fCurrency(product.salePrice)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                                {fCurrency(product.price)}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="subtitle2">
                            {fCurrency(product.price)}
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
