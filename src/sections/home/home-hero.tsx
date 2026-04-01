'use client';

import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { varAlpha } from 'minimal-shared/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProducts } from 'src/hooks/firebase';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

const MAIN_HERO_SLIDE = {
  id: 'main-hero',
  label: 'WELCOME TO',
  name: 'Component Pulse',
  caption:
    "Your trusted partner for premium electronic components, solar equipment, and DIY prototyping supplies in Uganda. Let's build the future together.",
  coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  link: paths.products,
  buttonText: 'Shop now',
};

export function HomeHero() {
  const theme = useTheme();

  // Fetch 2 featured products to use as the additional slides
  const { products } = useProducts({ isFeatured: true, limit: 2 });

  const isMobile = theme.breakpoints.down('md');

  const carousel = useCarousel(
    {
      loop: true,
      duration: 80,
    },
    // Only use Fade on desktop for better mobile performance
    typeof window !== 'undefined' && window.innerWidth >= 900
      ? [Autoplay({ delay: 5000 }), Fade()]
      : [Autoplay({ delay: 5000 })]
  );

  // Combine the main static slide with the dynamic product slides
  const slides = [
    MAIN_HERO_SLIDE,
    ...products.map((product) => ({
      id: product.id,
      label: 'HOT DEAL',
      name: product.name,
      caption: product.description || 'Explore this amazing product at Component Pulse today.',
      coverUrl:
        product.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      link: paths.product(product.slug || product.id),
      buttonText: 'View Product',
    })),
  ];

  return (
    <Box
      component="section"
      sx={{
        ...theme.mixins.bgGradient({
          images: [
            `linear-gradient(to bottom, ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)}, ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)})`,
            `url(${CONFIG.assetsDir}/assets/images/home/bg.avif)`,
          ],
        }),
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        component="img"
        alt="Texture"
        src={`${CONFIG.assetsDir}/assets/images/home/texture.jpg`}
        sx={{
          top: 0,
          right: 0,
          height: 1,
          width: 1,
          position: 'absolute',
          opacity: 0.1,
        }}
      />

      <Container sx={{ position: 'relative' }}>
        <Carousel carousel={carousel} sx={{ overflow: 'visible' }}>
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              slide={slide}
              selected={carousel.dots.selectedIndex === index}
            />
          ))}
        </Carousel>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'absolute', bottom: { xs: 24, md: 40 }, width: 1, left: 0, zIndex: 9 }}
        >
          <CarouselDotButtons
            variant="rounded"
            scrollSnaps={carousel.dots.scrollSnaps}
            selectedIndex={carousel.dots.selectedIndex}
            onClickDot={carousel.dots.onClickDot}
            sx={{ color: 'primary.main' }}
          />
        </Box>

        <CarouselArrowBasicButtons
          {...carousel.arrows}
          options={carousel.options}
          slotProps={{
            prevBtn: {
              sx: { ml: -2},
              svgIcon: (
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 5l-6 7l6 7"
                />
              ),
            },
            nextBtn: {
              sx: { mr: -2},
              svgIcon: (
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5l6 7l-6 7"
                />
              ),
            },
          }}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            top: '50%',
            left: 0,
            width: 1,
            transform: 'translateY(-50%)',
            justifyContent: 'space-between',
            px: { xs: 1, md: 2 },
            zIndex: 9,
          }}
        />
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  selected: boolean;
  slide: {
    label: string;
    name: string;
    caption: string;
    coverUrl: string;
    link: string;
    buttonText: string;
  };
};

export function CarouselItem({ slide, selected }: CarouselItemProps) {
  return (
    <Box
      gap={{ xs: 5, md: 8 }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={{ xs: 'column-reverse', md: 'row' }}
      sx={(theme) => ({
        py: { xs: 6, md: 10 },
        opacity: 0,
        minHeight: { xs: '70vh', md: 720 },
        transition: theme.transitions.create(['opacity'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
        ...(selected && { opacity: 1 }),
        // Performance optimization
        willChange: selected ? 'auto' : 'opacity',
      })}
    >
      <Box
        sx={(theme) => ({
          maxWidth: { xs: 1, md: 480 },
          width: 1,
          color: 'common.white',
          mx: { xs: 'auto', md: 'unset' },
          textAlign: { xs: 'center', md: 'unset' },
          // Premium Glassmorphism - Optimized for performance
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          backgroundColor: varAlpha(theme.vars.palette.background.defaultChannel, 0.08),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.1)}`,
          boxShadow: theme.customShadows.z24,
          // Mobile: Include image inside the card
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, md: 0 },
          // Performance optimizations
          willChange: selected ? 'auto' : 'opacity, transform',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        })}
      >
        {/* Image inside card on mobile only */}
        <Box
          component="img"
          alt={slide.name}
          src={slide.coverUrl}
          loading="eager"
          sx={(theme) => ({
            display: { xs: 'block', md: 'none' },
            width: '100%',
            height: 240,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 2,
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          })}
        />

        <Label variant="filled" color="warning" sx={{ mb: 2 }}>
          {slide.label}
        </Label>

        <Typography
          component="h3"
          variant="h3"
          sx={(theme) => ({
            mb: 2,
            typography: { xs: 'h4', md: 'h3' },
            ...(theme.mixins.maxLine({ line: 2 }) as any),
          })}
        >
          {slide.name}
        </Typography>

        <Box
          sx={(theme) => ({
            ...(theme.mixins.maxLine({ line: 2 }) as any),
            mb: 5,
            opacity: 0.72,
            typography: 'body2',
            '& *': {
              m: '0 !important',
              p: '0 !important',
              fontSize: 'inherit !important',
              fontWeight: 'inherit !important',
              lineHeight: 'inherit !important',
              color: 'inherit !important',
              display: 'inline !important',
            },
          })}
        >
          <Markdown children={slide.caption} />
        </Box>

        <Button
          component={RouterLink}
          href={slide.link}
          size="large"
          color="primary"
          variant="contained"
          endIcon={<Iconify width={16} icon="solar:alt-arrow-right-outline" sx={{ ml: -0.5 }} />}
        >
          {slide.buttonText}
        </Button>
      </Box>

      {/* Image outside card on desktop only */}
      <Box
        component="img"
        alt={slide.name}
        src={slide.coverUrl}
        loading="eager"
        sx={(theme) => ({
          display: { xs: 'none', md: 'block' },
          width: 480,
          height: 480,
          objectFit: 'cover',
          borderRadius: 4,
          filter: `drop-shadow(0 20px 40px ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)})`,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        })}
      />
    </Box>
  );
}
