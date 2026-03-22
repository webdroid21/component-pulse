'use client';

import type { Product } from 'src/types/product';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { toast } from 'sonner';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';


// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export function ProductItem({ product }: Props) {
  const checkout = useCheckoutContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity: 1,
      available: product.stock || 10,
    });

    toast.success('Added to cart');
  };

  const isSale = product.salePrice && product.salePrice < product.price;

  return (
    <Link component={RouterLink} href={paths.product(product.slug || product.id)} color="inherit" underline="none" sx={{ display: 'block', height: 1 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'transparent',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: 1,
          transition: (theme) =>
            theme.transitions.create('background-color', {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),
          '&:hover': {
            bgcolor: 'background.neutral',
          },
        }}
      >
        {/* Labels */}
        {(isSale || product.stock === 0) && (
          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}>
            {product.stock === 0 && <Label color="error">OUT OF STOCK</Label>}
            {isSale && product.stock > 0 && <Label color="error">SALE</Label>}
          </Stack>
        )}

        <Box
          component="img"
          alt={product.name}
          src={product.images?.[0]?.url || '/assets/placeholder.svg'}
          sx={{ mb: 2, borderRadius: 1.5, bgcolor: 'background.neutral', width: 1, aspectRatio: '1/1', objectFit: 'cover' }}
        />

        <Box gap={0.5} display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
          <Typography variant="caption" noWrap sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
            {product.categoryName || 'Category'}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 'fontWeightMedium',
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              minHeight: 44,
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ typography: 'subtitle2', mb: 2 }}>
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 'auto' }}>
            <IconButton
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <Iconify icon="solar:cart-plus-bold" />
            </IconButton>

            <Button
              component={RouterLink}
              href={paths.checkout}
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Link>
  );
}
