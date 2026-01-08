'use client';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const HERO_IMAGE = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80';

export function HomeHero() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 560, md: 680 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.75),
          },
        }}
      />

      {/* Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 680 }}>
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 2,
                mb: 2,
                display: 'block',
              }}
            >
              ⚡ Powering Uganda&apos;s Future
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'common.white',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Quality Electronic
              <Box component="span" sx={{ color: 'primary.main' }}> Components </Box>
              & Solar Solutions
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'grey.400',
                fontWeight: 400,
                mb: 4,
                maxWidth: 520,
              }}
            >
              Your trusted partner for solar panels, inverters, batteries, and electrical components. 
              Fast delivery across Uganda with competitive prices.
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={RouterLink}
                href={paths.products}
                variant="contained"
                size="large"
                endIcon={<Iconify icon="solar:arrow-right-bold" />}
                sx={{ px: 4, py: 1.5 }}
              >
                Shop Now
              </Button>
              <Button
                component={RouterLink}
                href={paths.contact}
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'common.white',
                  borderColor: 'grey.600',
                  '&:hover': {
                    borderColor: 'common.white',
                    bgcolor: 'transparent',
                  },
                }}
              >
                Get a Quote
              </Button>
            </Stack>
          </m.div>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 3, md: 6 }}
              sx={{ mt: 6 }}
            >
              {[
                { value: '5000+', label: 'Products' },
                { value: '2500+', label: 'Happy Customers' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    variant="h3"
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
