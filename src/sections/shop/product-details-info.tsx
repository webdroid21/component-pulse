import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { inputBaseClasses } from '@mui/material/InputBase';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';
import type { Product } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
    product: Product;
};

export function ProductDetailsInfo({ product }: Props) {
    const checkout = useCheckoutContext();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        checkout.onAddToCart({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            coverUrl: product.images?.[0]?.url || '',
            quantity,
            available: product.quantity || 10,
        });
    };

    const isSale = product.salePrice && product.salePrice < product.price;

    return (
        <Box>
            <Label color={product.quantity > 0 ? 'success' : 'error'} sx={{ mb: 3 }}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </Label>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {product.categoryName || 'General'}
                </Typography>
                <Typography variant="h4">{product.name}</Typography>

                {/* Note: This rating will be hydrated with actual data later */}
                <Stack spacing={0.5} direction="row" alignItems="center">
                    <Rating size="small" value={4.5} readOnly precision={0.5} />
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        (24 reviews)
                    </Typography>
                </Stack>
            </Stack>

            <Stack spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} sx={{ typography: 'h5' }}>
                    {isSale ? (
                        <>
                            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                                {fCurrency(product.price)}
                            </Box>
                            <Box component="span" sx={{ color: 'error.main' }}>
                                {fCurrency(product.salePrice)}
                            </Box>
                        </>
                    ) : (
                        <Box component="span">{fCurrency(product.price)}</Box>
                    )}
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.description || 'No description available for this product.'}
                </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

            <Box
                gap={2}
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ md: 'center' }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>Qty:</Typography>
                    <TextField
                        select
                        hiddenLabel
                        SelectProps={{ native: true }}
                        value={quantity}
                        onChange={(event) => setQuantity(Number(event.target.value))}
                        sx={{
                            minWidth: 100,
                            [`& .${inputBaseClasses.input}`]: { py: 0, height: 48 },
                        }}
                    >
                        {Array.from({ length: Math.min(product.quantity || 10, 10) }, (_, i) => i + 1).map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                </Stack>

                <Box gap={2} display="flex" flexGrow={1} justifyContent="flex-end">
                    <Button
                        size="large"
                        color="inherit"
                        variant="contained"
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                        startIcon={<Iconify icon="solar:cart-3-outline" />}
                        sx={{ width: { xs: 1, sm: 'auto' } }}
                    >
                        Add to cart
                    </Button>

                    <Button
                        component={RouterLink}
                        href={paths.checkout}
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                        sx={{ width: { xs: 1, sm: 'auto' } }}
                    >
                        Buy now
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

            <Stack spacing={2}>
                {[
                    { icon: 'solar:delivery-bold', text: 'Free delivery on orders over UGX 500,000' },
                    { icon: 'solar:shield-check-bold', text: 'Warranty included' },
                    { icon: 'solar:refresh-bold', text: '7-day return policy' },
                ].map((feature) => (
                    <Stack key={feature.text} direction="row" alignItems="center" spacing={1.5}>
                        <Iconify icon={feature.icon} width={20} sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {feature.text}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
