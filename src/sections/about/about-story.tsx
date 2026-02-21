'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function AboutStory() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, mt: 1 }}>
                To democratize access to high-quality electronic components and embedded systems knowledge across Uganda and East Africa, empowering innovators, students, and professionals to build the technology solutions of tomorrow.
              </Typography>

              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                To become the leading hub for embedded systems education and components supply in East Africa, fostering a thriving ecosystem of innovation and technological advancement.
              </Typography>
            </m.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                alt="Solar installation"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: (theme) => theme.shadows[16],
                }}
              />
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
