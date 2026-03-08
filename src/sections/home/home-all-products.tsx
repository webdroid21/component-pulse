'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProducts } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';

import { ProductItem } from 'src/sections/shop/product-item';

// ----------------------------------------------------------------------

export function HomeAllProducts() {
  const { products, loading } = useProducts({ isActive: true, limit: 8 });

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Container>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: { xs: 5, md: 8 } }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Our Products
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Explore our wide range of electronic components and equipment.
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            href={paths.products}
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          >
            View All
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {products.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductItem product={product} />
              </m.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
