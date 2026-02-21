'use client';

import type { Product } from 'src/types/product';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity: 1,
      available: product.quantity || 10,
    });
  };

  const isSale = product.salePrice && product.salePrice < product.price;

  return (
    <Box
      sx={{
        minWidth: 0,
        position: 'relative',
        '&:hover .add-to-cart': {
          opacity: 1,
        },
      }}
    >
      {(isSale || product.quantity === 0) && (
        <Box gap={1} display="flex" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 9 }}>
          {product.quantity === 0 && <Label color="error">OUT OF STOCK</Label>}
          {isSale && product.quantity > 0 && <Label color="error">SALE</Label>}
        </Box>
      )}

      <Box sx={{ position: 'relative', mb: 2 }}>
        {product.quantity > 0 && (
          <Fab
            onClick={handleAddToCart}
            className="add-to-cart"
            color="primary"
            size="small"
            sx={{
              right: 8,
              zIndex: 9,
              bottom: 8,
              opacity: 0,
              position: 'absolute',
              transition: (theme) => theme.transitions.create('opacity'),
            }}
          >
            <Iconify icon="solar:cart-plus-bold" />
          </Fab>
        )}

        <Link component={RouterLink} href={paths.product(product.slug || product.id)}>
          <Box
            component="img"
            alt={product.name}
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              aspectRatio: '1/1',
              flexShrink: 0,
              borderRadius: 1.5,
              bgcolor: 'background.neutral',
            }}
          />
        </Link>
      </Box>

      <Box gap={0.5} display="flex" flexDirection="column">
        <Typography variant="caption" noWrap sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
          {product.categoryName || 'Category'}
        </Typography>

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

        {/* Product Price component mockup */}
        <Stack direction="row" spacing={1} sx={{ typography: 'subtitle2' }}>
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
      </Box>
    </Box>
  );
}
