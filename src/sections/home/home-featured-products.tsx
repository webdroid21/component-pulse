'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';

import { useProducts } from 'src/hooks/firebase';

import { ProductItemHot } from './product-item-hot';
import { ProductItemCountDown } from './product-item-count-down';

// ----------------------------------------------------------------------

export function HomeFeaturedProducts() {
  const { products, loading } = useProducts({ isFeatured: true, limit: 6 });

  const largeProducts = products.slice(0, 2);
  const smallProducts = products.slice(2, 6);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Container>
        <Typography
          variant="h3"
          sx={{
            mb: { xs: 5, md: 8 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          Featured products
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                  <Paper key={i} sx={{ p: 3, borderRadius: 2 }}>
                    <Skeleton variant="rounded" width="100%" height={300} />
                    <Skeleton variant="text" width="60%" height={40} sx={{ mt: 3, mx: 'auto' }} />
                    <Skeleton variant="text" width="40%" height={32} sx={{ mx: 'auto' }} />
                  </Paper>
                ))
                : largeProducts.map((product, index) => (
                  <ProductItemCountDown
                    key={product.id}
                    product={product}
                    sx={{
                      ...(index === 1 && {
                        color: 'secondary.darker',
                        bgcolor: 'secondary.lighter',
                        '&:hover': { bgcolor: 'secondary.light' },
                      }),
                    }}
                  />
                ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Skeleton variant="rounded" width="100%" sx={{ aspectRatio: '1/1' }} />
                    <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="50%" />
                  </Paper>
                ))
                : smallProducts.map((product) => (
                  <ProductItemHot key={product.id} product={product} />
                ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
