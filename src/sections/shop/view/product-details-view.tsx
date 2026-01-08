'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProduct } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export function ProductDetailsView({ slug }: Props) {
  const { product, loading } = useProduct(slug);
  const checkout = useCheckoutContext();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentTab, setCurrentTab] = useState('description');

  const handleAddToCart = () => {
    if (!product) return;

    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity,
      available: product.quantity || 10,
    });
  };

  const discount = product?.salePrice && product.salePrice < product.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="80%" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="text" width="100%" height={100} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
        <Iconify icon="solar:box-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          Product not found
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </Typography>
        <Button component={RouterLink} href={paths.products} variant="contained">
          Browse Products
        </Button>
      </Container>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80' }];

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link component={RouterLink} href="/" color="inherit" underline="hover">
            Home
          </Link>
          <Link component={RouterLink} href={paths.products} color="inherit" underline="hover">
            Shop
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 500 },
                    objectFit: 'contain',
                    bgcolor: 'grey.100',
                  }}
                />

                {discount > 0 && (
                  <Chip
                    label={`-${discount}% OFF`}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontWeight: 700,
                    }}
                  />
                )}
              </Box>

              {images.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                  {images.map((image: any, index: number) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Card>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              {product.categoryName || 'Electronics'}
            </Typography>

            <Typography variant="h3" sx={{ mt: 1, mb: 2 }}>
              {product.name}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Rating value={4.5} readOnly precision={0.5} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                (24 reviews)
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 3 }}>
              {product.salePrice && product.salePrice < product.price ? (
                <>
                  <Typography variant="h3" sx={{ color: 'error.main' }}>
                    {fCurrency(product.salePrice)}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                  >
                    {fCurrency(product.price)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h3">
                  {fCurrency(product.price)}
                </Typography>
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Stock status */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              {product.quantity > 0 ? (
                <>
                  <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    In Stock ({product.quantity} available)
                  </Typography>
                </>
              ) : (
                <>
                  <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    Out of Stock
                  </Typography>
                </>
              )}
            </Stack>

            {/* Quantity selector */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Quantity:</Typography>
              <Stack direction="row" alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  sx={{ minWidth: 40 }}
                >
                  -
                </Button>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= (product.quantity || 99)) {
                      setQuantity(val);
                    }
                  }}
                  size="small"
                  sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setQuantity(Math.min(product.quantity || 99, quantity + 1))}
                  disabled={quantity >= (product.quantity || 99)}
                  sx={{ minWidth: 40 }}
                >
                  +
                </Button>
              </Stack>
            </Stack>

            {/* Action buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<Iconify icon="solar:cart-plus-bold" />}
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
              >
                Add to Cart
              </Button>
              <Button
                size="large"
                variant="outlined"
                sx={{ minWidth: 56 }}
              >
                <Iconify icon="solar:heart-bold" width={24} />
              </Button>
            </Stack>

            {/* Features */}
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
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value="description" label="Description" />
            <Tab value="specifications" label="Specifications" />
            <Tab value="reviews" label="Reviews (24)" />
          </Tabs>

          <Box sx={{ py: 4 }}>
            {currentTab === 'description' && (
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {product.description || 'No description available for this product.'}
              </Typography>
            )}

            {currentTab === 'specifications' && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Specifications will be displayed here based on product data.
                </Typography>
              </Box>
            )}

            {currentTab === 'reviews' && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Customer reviews coming soon.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
