'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const STATS = [
  { value: '5+', label: 'Years of Experience' },
  { value: '5000+', label: 'Products Available' },
  { value: '2500+', label: 'Happy Customers' },
  { value: '50+', label: 'Team Members' },
];

export function AboutStats() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'primary.main' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {STATS.map((stat, index) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: 'common.white',
                    fontWeight: 800,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.lighter',
                    mt: 1,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
