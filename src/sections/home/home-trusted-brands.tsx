'use client';

import { m } from 'framer-motion';
import AutoScroll from 'embla-carousel-auto-scroll';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Carousel, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const BRANDS = [
  { name: 'Arduino', image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg' },
  { name: 'Raspberry Pi', image: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg' },
  { name: 'Espressif', image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Espressif_Systems_logo.svg' },
  { name: 'Adafruit', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Adafruit_logo.svg' },
  { name: 'SparkFun', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/SparkFun_Electronics_logo.svg' },
  { name: 'Seeed Studio', image: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Seeed_Studio_Logo.svg' },
  { name: 'Victron Energy', image: 'https://www.victronenergy.com/upload/logos/victron-energy-logo-2023.png' },
  { name: 'Growatt', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Growatt_Logo.svg/1024px-Growatt_Logo.svg.png' },
];

// ----------------------------------------------------------------------

export function HomeTrustedBrands() {
  const carousel = useCarousel(
    {
      loop: true,
      align: 'center',
      slidesToShow: { xs: 2.5, sm: 4, md: 5, lg: 6 },
      slideSpacing: '24px',
    },
    [AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: false })]
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.neutral' }}>
      <Container maxWidth="lg">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Trusted Brands
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              We partner with industry-leading manufacturers to bring you reliable components and equipment.
            </Typography>
          </Box>
        </m.div>

        <Carousel carousel={carousel}>
          {BRANDS.map((brand, index) => (
            <Card
              key={brand.name + index}
              sx={{
                p: 3,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z1,
              }}
            >
              <Box
                component="img"
                src={brand.image}
                alt={brand.name}
                sx={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'grayscale(100%) opacity(0.7)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    filter: 'grayscale(0%) opacity(1)',
                  },
                }}
              />
            </Card>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
}
