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
                Our Story
              </Typography>
              <Typography variant="h2" sx={{ mt: 1, mb: 3 }}>
                Building Uganda&apos;s Energy Future
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                Founded in 2018, ComponentPulse started with a simple vision: to make reliable, 
                affordable electronic components and solar solutions accessible to every Ugandan. 
                What began as a small shop in Kampala has grown into one of the country&apos;s most 
                trusted suppliers of electrical equipment.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                Today, we serve thousands of customers ranging from individual homeowners to 
                large-scale commercial projects. Our commitment to quality products, competitive 
                pricing, and exceptional customer service has made us the preferred choice for 
                solar installers, electrical contractors, and DIY enthusiasts across Uganda.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                We believe that access to clean, reliable energy is a right, not a privilege. 
                That&apos;s why we work tirelessly to source the best products at the most competitive 
                prices, making sustainable energy solutions affordable for everyone.
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
