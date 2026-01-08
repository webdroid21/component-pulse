'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const BRANDS = [
  { name: 'JA Solar', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/JA_Solar_logo.svg/200px-JA_Solar_logo.svg.png' },
  { name: 'Growatt', logo: 'https://en.growatt.com/static/images/logo.png' },
  { name: 'Felicity Solar', logo: 'https://felicitysolar.com/wp-content/uploads/2021/01/logo.png' },
  { name: 'Must Energy', logo: 'https://www.must-energy.com/images/logo.png' },
  { name: 'Victron Energy', logo: 'https://www.victronenergy.com/media/pg/VE_logo.png' },
  { name: 'LONGi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/LONGi_Green_Energy_logo.svg/200px-LONGi_Green_Energy_logo.svg.png' },
];

export function HomeBrands() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 4,
            }}
          >
            Trusted by leading brands
          </Typography>
        </m.div>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 4, md: 8 },
          }}
        >
          {BRANDS.map((brand, index) => (
            <m.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Box
                sx={{
                  height: 40,
                  opacity: 0.6,
                  filter: 'grayscale(100%)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    opacity: 1,
                    filter: 'grayscale(0%)',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {brand.name}
                </Typography>
              </Box>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
