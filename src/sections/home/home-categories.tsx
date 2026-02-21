'use client';

import AutoScroll from 'embla-carousel-auto-scroll';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCategories } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselDotButtons, CarouselArrowBasicButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function HomeCategories() {
  const { categories, loading } = useCategories();

  const activeCategories = categories.filter((cat) => cat.isActive);

  const carousel = useCarousel(
    {
      loop: true,
      align: 'start',
      slidesToShow: { xs: 1.2, sm: 2.2, md: 3.2 },
      slideSpacing: '16px',
    },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.100', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Browse Categories
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: 1.5 }}>
              Shop by Category
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520, mx: 'auto' }}>
              Find exactly what you need from our wide range of electronic components and solar equipment
            </Typography>
          </Box>
        </m.div>

        {loading ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ minWidth: 260, flexShrink: 0 }}>
                <Card sx={{ p: 3 }}>
                  <Skeleton variant="rounded" width={56} height={56} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="65%" height={28} />
                  <Skeleton variant="text" width="90%" />
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <>
            <Carousel carousel={carousel}>
              {activeCategories.map((category) => {
                const href = `${paths.products}?category=${category.slug}`;
                const color = category.color || '#2196F3';
                const icon = category.icon || 'solar:box-bold-duotone';

                return (
                  <Card
                    key={category.id}
                    sx={{
                      height: '100%',
                      overflow: 'hidden',
                      '&:hover .category-icon': { transform: 'translateY(-4px)' },
                    }}
                  >
                    <CardActionArea
                      component={RouterLink}
                      href={href}
                      sx={{ height: '100%', p: 3 }}
                    >
                      <Stack spacing={2}>
                        <Box
                          className="category-icon"
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${color}20`,
                            transition: 'transform 0.3s',
                          }}
                        >
                          <Iconify icon={icon} width={28} sx={{ color }} />
                        </Box>

                        <Box>
                          <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {category.description || `Browse ${category.name} products`}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                          <Typography variant="caption" fontWeight={600} sx={{ mr: 0.5 }}>
                            Browse Products
                          </Typography>
                          <Iconify icon="solar:arrow-right-bold" width={14} />
                        </Box>
                      </Stack>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Carousel>

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
              <CarouselDotButtons
                scrollSnaps={carousel.dots.scrollSnaps}
                selectedIndex={carousel.dots.selectedIndex}
                onClickDot={carousel.dots.onClickDot}
                sx={{ color: 'primary.main' }}
              />
            </Box>

            {!loading && activeCategories.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Iconify icon="solar:box-bold-duotone" width={48} sx={{ mb: 1, opacity: 0.4 }} />
                <Typography variant="body1">No categories available yet.</Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
