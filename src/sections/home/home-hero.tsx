'use client';

import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

const HERO_SLIDES = [
  {
    id: '1',
    label: 'NEW ARRIVAL',
    name: 'Arduino Uno R3',
    caption: 'The classic microcontroller board for all your DIY electronics and prototyping needs.',
    coverUrl: 'https://www.campuscomponent.com/product-images/Arduino+UNO+R3+Compatible+Board-AR-134-D-min.jpg/2208614000020620127/1100x1100',
  },
  {
    id: '2',
    label: 'HOT DEAL',
    name: 'Raspberry Pi 4',
    caption: 'Your tiny, dual-display, desktop computer... and robot brains, smart home hub, media centre, networked AI core, factory controller.',
    coverUrl: 'https://en.opensuse.org/images/1/1a/Raspberry-Pi4.png',
  },
  {
    id: '3',
    label: 'ESSENTIALS',
    name: 'Premium Jumper Wires',
    caption: 'High-quality, durable jumper wires in various lengths and male/female configurations.',
    coverUrl: 'https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/4/0/40_pin_female_to_male_jumper_wire__79923.1571491579.jpg',
  },
];

export function HomeHero() {
  const theme = useTheme();

  const carousel = useCarousel(
    {
      loop: true,
      duration: 80,
    },
    [Autoplay({ delay: 5000 }), Fade()]
  );

  return (
    <Box
      component="section"
      sx={{
        ...(theme.mixins.bgGradient({
          images: [
            `linear-gradient(to bottom, ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)}, ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)})`,
            `url(${CONFIG.assetsDir}/assets/background/overlay-2.webp)`,
          ]
        })),
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
          opacity: 0.04,
        }}
      />

      <Container sx={{ position: 'relative' }}>
        <Carousel carousel={carousel} sx={{ overflow: 'visible' }}>
          {HERO_SLIDES.map((slide, index) => (
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
          justifyContent="space-between"
          sx={{ transform: 'translateY(-64px)' }}
        >
          <CarouselDotButtons
            variant="rounded"
            scrollSnaps={carousel.dots.scrollSnaps}
            selectedIndex={carousel.dots.selectedIndex}
            onClickDot={carousel.dots.onClickDot}
            sx={{ color: 'primary.main' }}
          />

          <CarouselArrowBasicButtons
            {...carousel.arrows}
            options={carousel.options}
            slotProps={{
              prevBtn: {
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
            sx={{ gap: 1, color: 'primary.main' }}
          />
        </Box>
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
  };
};

export function CarouselItem({ slide, selected }: CarouselItemProps) {
  return (
    <Box
      gap={8}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={(theme) => ({
        py: 15,
        opacity: 0,
        minHeight: 720,
        transition: theme.transitions.create(['opacity'], {
          easing: theme.transitions.easing.easeIn,
          duration: theme.transitions.duration.complex,
        }),
        ...(selected && { opacity: 1 }),
      })}
    >
      <Box
        sx={{
          maxWidth: 440,
          color: 'common.white',
          mx: { xs: 'auto', md: 'unset' },
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Label variant="filled" color="warning" sx={{ mb: 2 }}>
          {slide.label}
        </Label>

        <Typography component="h3" variant="h2" sx={{ mb: 2 }}>
          {slide.name}
        </Typography>

        <Typography
          variant="body2"
          sx={(theme) => ({
            ...(theme.mixins.maxLine({ line: 2 }) as any),
            mb: 5,
            opacity: 0.72,
          })}
        >
          {slide.caption}
        </Typography>

        <Button
          component={RouterLink}
          href={paths.products}
          size="large"
          color="primary"
          variant="contained"
          endIcon={<Iconify width={16} icon="solar:alt-arrow-right-outline" sx={{ ml: -0.5 }} />}
        >
          Shop now
        </Button>
      </Box>

      <Box
        component="img"
        alt={slide.name}
        src={slide.coverUrl}
        sx={(theme) => ({
          width: 480,
          height: 480,
          objectFit: 'cover',
          borderRadius: 4,
          filter: `drop-shadow(20px 20px 24px ${varAlpha(theme.vars.palette.common.blackChannel, 0.8)})`,
        })}
      />
    </Box>
  );
}
