'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const VALUES = [
  {
    icon: 'solar:verified-check-bold-duotone',
    title: 'Quality First',
    description: 'We source only genuine, high-quality components from trusted manufacturers.',
    color: '#2196F3',
  },
  {
    icon: 'solar:users-group-rounded-bold-duotone',
    title: 'Customer Focus',
    description: "Our customers' success is our priority. We provide expert support and guidance.",
    color: '#4CAF50',
  },
  {
    icon: 'solar:lightbulb-bolt-bold-duotone',
    title: 'Innovation',
    description: 'We stay at the forefront of technology to bring you the latest solutions.',
    color: '#9C27B0',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'Reliability',
    description: 'Count on us for consistent supply, competitive pricing, and dependable service.',
    color: '#FF9800',
  },
];

export function AboutValues() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.100' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Our Values
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, maxWidth: 640, mx: 'auto' }}>
              These core values guide everything we do and shape our relationships with customers, partners, and the community.
            </Typography>
          </m.div>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          {VALUES.map((value, index) => (
            <m.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ p: 4, height: '100%', display: 'flex', gap: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    flexShrink: 0,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${value.color}15`,
                  }}
                >
                  <Iconify icon={value.icon} width={32} sx={{ color: value.color }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {value.description}
                  </Typography>
                </Box>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
