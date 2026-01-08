'use client';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'solar:verified-check-bold-duotone',
    title: 'Quality Guaranteed',
    description: 'All our products are sourced from certified manufacturers and come with warranty.',
    color: '#2196F3',
  },
  {
    icon: 'solar:delivery-bold-duotone',
    title: 'Fast Delivery',
    description: 'Same-day delivery in Kampala and express shipping nationwide within 24-48 hours.',
    color: '#4CAF50',
  },
  {
    icon: 'solar:hand-money-bold-duotone',
    title: 'Best Prices',
    description: 'Competitive wholesale and retail prices. We match any genuine competitor quote.',
    color: '#FF9800',
  },
  {
    icon: 'solar:headphones-round-sound-bold-duotone',
    title: '24/7 Support',
    description: 'Our technical team is always available to help with installation and troubleshooting.',
    color: '#9C27B0',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'Secure Payments',
    description: 'Multiple secure payment options including Mobile Money, cards, and bank transfers.',
    color: '#F44336',
  },
  {
    icon: 'solar:refresh-bold-duotone',
    title: 'Easy Returns',
    description: '7-day return policy on all products. No questions asked refund guarantee.',
    color: '#00BCD4',
  },
];

export function HomeWhyChooseUs() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Why Choose Us
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2 }}>
              The ComponentPulse Advantage
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              We&apos;re committed to providing the best products and services to power your projects
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
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {FEATURES.map((feature, index) => (
            <m.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => `0 20px 40px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                    borderColor: feature.color,
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box
                  className="feature-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${feature.color}15`,
                    transition: 'transform 0.3s',
                  }}
                >
                  <Iconify icon={feature.icon} width={40} sx={{ color: feature.color }} />
                </Box>

                <Typography variant="h5" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
