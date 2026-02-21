'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProduct } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductReviews } from '../product-reviews';
import { ProductDetailsInfo } from '../product-details-info';
import { ProductDetailsCarousel } from '../product-details-carousel';

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export function ProductDetailsView({ slug }: Props) {
  const { product, loading } = useProduct(slug);

  const [currentTab, setCurrentTab] = useState('description');

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
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
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
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
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Shop', href: paths.products },
            { name: product.name },
          ]}
          sx={{ mb: 5 }}
        />

        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 6, lg: 7 }}>
            <ProductDetailsCarousel images={images} productName={product.name} />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <ProductDetailsInfo product={product} />
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
                <ProductReviews productId={product.id} />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
