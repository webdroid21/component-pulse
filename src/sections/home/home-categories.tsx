'use client';

import { varAlpha } from 'minimal-shared/utils';
import AutoScroll from 'embla-carousel-auto-scroll';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCategories } from 'src/hooks/firebase';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { alpha } from '@mui/material';

import { Carousel, useCarousel, CarouselDotButtons, CarouselArrowBasicButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function HomeCategories() {
  const { categories, loading } = useCategories();

  const activeCategories = categories.filter((cat) => cat.isActive);

  const carousel = useCarousel(
    {
      loop: true,
      align: 'start',
      slidesToShow: { xs: 2, sm: 3, md: 4, lg: 6 },
      slideSpacing: '24px',
    },
    [AutoScroll({ speed: 1.2, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Box
          gap={3}
          display="flex"
          alignItems="center"
          flexDirection={{ xs: 'column', md: 'row' }}
          sx={{ mb: { xs: 5, md: 8 } }}
        >
          <Typography variant="h3" sx={{ textAlign: { xs: 'center', md: 'unset' } }}>
            Categories
          </Typography>

          <Box flexGrow={1} />

          <CarouselArrowBasicButtons
            {...carousel.arrows}
            options={carousel.options}
            sx={{
              gap: 1,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" gap={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Paper
                key={i}
                variant="outlined"
                sx={{
                  flexShrink: 0,
                  width: {
                    xs: 'calc(50% - 12px)',
                    sm: 'calc(33.333% - 16px)',
                    md: 'calc(25% - 18px)',
                    lg: 'calc(16.666% - 20px)',
                  },
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'transparent',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  aspectRatio: '1/1',
                }}
              >
                <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={80} />
              </Paper>
            ))}
          </Box>
        ) : (
          <Carousel carousel={carousel}>
            {[...activeCategories, ...activeCategories, ...activeCategories].map((category) => {
              const href = `${paths.products}?category=${category.slug}`;
              const color = category.color || 'primary.main';
              const icon = category.icon || 'solar:box-bold-duotone';
              const hasImage = !!category.image;

              return (
                <Paper
                  component={RouterLink}
                  href={href}
                  key={category.id}
                  variant="outlined"
                  sx={(theme) => ({
                    position: 'relative',
                    minWidth: 0,
                    borderRadius: 2,
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: hasImage ? 'common.white' : 'text.primary',
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    p: 2,
                    transition: theme.transitions.create(['all']),
                    '&:hover': {
                      boxShadow: theme.customShadows.z20,
                      transform: 'translateY(-4px)',
                    },
                    ...(hasImage && {
                      border: 'none',
                    }),
                  })}
                >
                  {hasImage && (
                    <Image
                      alt={category.name}
                      src={category.image}
                      sx={(theme) => ({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 1,
                        height: 1,
                        zIndex: 0,
                      })}
                      slotProps={{
                        overlay: {
                          sx: (theme) => ({
                            bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.6),
                            transition: theme.transitions.create(['background-color']),
                            '&:hover': {
                              bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.4),
                            },
                          }),
                        },
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: hasImage ? alpha('#ffffff', 0.2) : `${color}20`,
                        color: hasImage
                          ? 'common.white'
                          : typeof color === 'string' && color.includes('.')
                            ? color
                            : undefined,
                        backdropFilter: hasImage ? 'blur(4px)' : 'none',
                      }}
                    >
                      <Iconify
                        icon={icon}
                        width={40}
                        sx={{
                          color:
                            !hasImage && typeof color === 'string' && !color.includes('.')
                              ? color
                              : undefined,
                        }}
                      />
                    </Box>

                    <Typography variant="subtitle2" noWrap sx={{ width: 1, textAlign: 'center' }}>
                      {category.name}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Carousel>
        )}

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
      </Container>
    </Box>
  );
}
