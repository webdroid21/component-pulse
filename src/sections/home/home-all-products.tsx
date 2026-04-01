'use client';

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
import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

import { ProductItem } from 'src/sections/shop/product-item';

// ----------------------------------------------------------------------

export function HomeAllProducts() {
  const { products, loading } = useProducts({ isActive: true, limit: 8 });

  const carousel = useCarousel({
    slidesToShow: { xs: 2, sm: 2, md: 3, lg: 4 },
    slidesToScroll: 2,
    slideSpacing: '16px',
  });

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
          <>
            <Carousel carousel={carousel}>
              {products.map((product, index) => (
                <ProductItem key={`${product.id}-${index}`} product={product} />
              ))}
            </Carousel>

            <CarouselDotButtons
              scrollSnaps={carousel.dots.scrollSnaps}
              selectedIndex={carousel.dots.selectedIndex}
              onClickDot={carousel.dots.onClickDot}
              sx={{
                mt: 8,
                width: 1,
                color: 'primary.main',
                justifyContent: 'center',
                display: { xs: 'inline-flex', md: 'none' },
              }}
            />
          </>
        )}
      </Container>
    </Box>
  );
}
