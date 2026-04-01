import type { Product } from 'src/types/product';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { inputBaseClasses } from '@mui/material/InputBase';

import { toast } from 'sonner';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { useCheckoutContext } from 'src/sections/checkout/context';
import { useGetApprovedReviews } from 'src/hooks/firebase/use-reviews';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export function ProductDetailsInfo({ product }: Props) {
  const checkout = useCheckoutContext();
  const { approvedReviews: reviews } = useGetApprovedReviews(product.id);
  const [quantity, setQuantity] = useState(1);

  const totalReviews = reviews.length;
  const ratingAverage =
    totalReviews > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews : 0;

  const handleAddToCart = () => {
    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity,
      available: product.stock || 0,
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const isSale = product.salePrice && product.salePrice < product.price;

  return (
    <Box>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        {/*<Label color={product.stock > 0 ? 'success' : 'error'}>*/}
        {/*    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}*/}
        {/*</Label>*/}

        <IconButton onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
        </IconButton>
      </Stack>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {product.categoryName || 'General'}
        </Typography>
        <Typography variant="h4">{product.name}</Typography>

        {/* Dynamic DB Ratings */}
        <Stack spacing={0.5} direction="row" alignItems="center">
          <Rating size="small" value={ratingAverage} readOnly precision={0.5} />
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            ({totalReviews} review{totalReviews !== 1 && 's'})
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
        <Box>
          <Markdown
            children={product.description || 'No description available for this product.'}
          />
        </Box>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

      <Box
        gap={2}
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ md: 'center' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            Qty:
          </Typography>
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
            {Array.from({ length: Math.min(product.stock || 1, 10) }, (_, i) => i + 1).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </TextField>
        </Stack>

        <Box gap={2} display="flex" flexGrow={1} justifyContent="flex-end">
          <Button
            size="large"
            color="inherit"
            variant="contained"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
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
            disabled={product.stock === 0}
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
