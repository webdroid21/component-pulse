import type { PaperProps } from '@mui/material/Paper';
import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = PaperProps & {
    product: Product;
};

export function ProductItemFeaturedByBrand({ product, sx, ...other }: Props) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                gap: 2,
                minWidth: 0,
                borderRadius: 2,
                display: 'flex',
                bgcolor: 'transparent',
                ...sx,
            }}
            {...other}
        >
            <Box
                component="img"
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
                sx={{
                    width: 128,
                    height: 128,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    objectFit: 'cover',
                    bgcolor: 'background.neutral',
                }}
            />

            <Box gap={0.5} display="flex" flexDirection="column" flex="1 1 auto" sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 'fontWeightMedium' }}>
                    {product.name}
                </Typography>

                <Typography variant="caption" noWrap sx={{ color: 'text.disabled' }}>
                    {product.categoryName || 'General'}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
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

                <Box display="flex" flexGrow={1} alignItems="flex-end" justifyContent="flex-end">
                    <Button
                        component={RouterLink}
                        href={paths.product(product.slug || product.id)}
                        size="small"
                        color="inherit"
                        variant="outlined"
                    >
                        Buy now
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
