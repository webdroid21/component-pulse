'use client';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const HERO_IMAGE = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&q=80';

export function AboutHero() {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
        minHeight: { xs: 400, md: 480 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
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
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.8),
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, mb: 2, display: 'block' }}>
            About Us
          </Typography>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Typography variant="h1" sx={{ color: 'common.white', mb: 3 }}>
            Powering Uganda&apos;s Future
          </Typography>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            We&apos;re on a mission to make quality electronic components and solar solutions accessible to every Ugandan.
          </Typography>
        </m.div>
      </Container>
    </Box>
  );
}
