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

const BG_IMAGE = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&q=80';

export function HomeCTA() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.9),
          },
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'common.white', mb: 3 }}>
              Ready to Power Up Your Projects?
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'common.white',
                opacity: 0.9,
                fontWeight: 400,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Get in touch with our team for bulk orders, custom solutions, or technical consultations. 
              We&apos;re here to help you succeed.
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                href={paths.contact}
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: 'common.white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
                startIcon={<Iconify icon="solar:chat-round-dots-bold" />}
              >
                Contact Sales
              </Button>
              <Button
                component="a"
                href="https://wa.me/256700000000"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'common.white',
                  borderColor: 'common.white',
                  '&:hover': {
                    borderColor: 'common.white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
                startIcon={<Iconify icon="mdi:whatsapp" />}
              >
                WhatsApp Us
              </Button>
            </Stack>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
