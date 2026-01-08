'use client';

import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export function ProductItem({ product }: Props) {
  const checkout = useCheckoutContext();

  const handleAddToCart = () => {
    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity: 1,
      available: product.quantity || 10,
    });
  };

  const discount = product.salePrice && product.salePrice < product.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          '& .product-image': {
            transform: 'scale(1.05)',
          },
          '& .add-to-cart-btn': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          className="product-image"
          component="img"
          height="220"
          image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
          alt={product.name}
          sx={{ transition: 'transform 0.3s', objectFit: 'cover' }}
        />

        {discount > 0 && (
          <Chip
            label={`-${discount}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 700,
            }}
          />
        )}

        {product.quantity === 0 && (
          <Chip
            label="Out of Stock"
            color="default"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 600,
            }}
          />
        )}

        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
          }}
        >
          <Iconify icon="solar:heart-bold" width={20} />
        </IconButton>

        <Button
          className="add-to-cart-btn"
          variant="contained"
          size="small"
          startIcon={<Iconify icon="solar:cart-plus-bold" />}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            opacity: 0,
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
          }}
        >
          Add to Cart
        </Button>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {product.categoryName || 'Electronics'}
        </Typography>

        <Typography
          component={RouterLink}
          href={paths.product(product.slug || product.id)}
          variant="subtitle1"
          sx={{
            mt: 0.5,
            mb: 'auto',
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': { color: 'primary.main' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          {product.salePrice && product.salePrice < product.price ? (
            <>
              <Typography variant="h6" sx={{ color: 'error.main' }}>
                {fCurrency(product.salePrice)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
              >
                {fCurrency(product.price)}
              </Typography>
            </>
          ) : (
            <Typography variant="h6">
              {fCurrency(product.price)}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
