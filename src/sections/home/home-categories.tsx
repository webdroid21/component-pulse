'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CATEGORIES = [
  {
    title: 'Cables & Wires',
    description: 'Hook-up wires, coaxial, and ribbon cables for all projects',
    icon: 'solar:cable-bold-duotone',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?w=400&q=80',
    href: `${paths.products}?category=cables`,
    color: '#FF9800',
  },
  {
    title: 'Fuses & Protection',
    description: 'Glass fuses, thermal fuses, and circuit breakers',
    icon: 'solar:shield-warning-bold-duotone',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&q=80',
    href: `${paths.products}?category=protection`,
    color: '#F44336',
  },
  {
    title: 'Resistors & Capacitors',
    description: 'Through-hole and SMD components for circuitry',
    icon: 'solar:cpu-bolt-bold-duotone',
    image: 'https://images.unsplash.com/photo-1563770095-39d468f9a51d?w=400&q=80',
    href: `${paths.products}?category=passive`,
    color: '#2196F3',
  },
  {
    title: 'Connectors',
    description: 'Terminal blocks, headers, and audio/video connectors',
    icon: 'solar:plug-circle-bold-duotone',
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=400&q=80',
    href: `${paths.products}?category=connectors`,
    color: '#9C27B0',
  },
  {
    title: 'Switches & Relays',
    description: 'Toggle, rocker, pushbutton switches and relays',
    icon: 'solar:power-bold-duotone',
    image: 'https://images.unsplash.com/photo-1610450949065-d602db9b7dfb?w=400&q=80',
    href: `${paths.products}?category=switches`,
    color: '#4CAF50',
  },
  {
    title: 'Tools & Soldering',
    description: 'Soldering irons, multimeters, and precision tools',
    icon: 'solar:screwdrivers-bold-duotone',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
    href: `${paths.products}?category=tools`,
    color: '#FFEB3B',
  },
];

export function HomeCategories() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.100' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Browse Categories
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2 }}>
              Shop by Category
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Find exactly what you need from our wide range of electronic components and solar equipment
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
          {CATEGORIES.map((category, index) => (
            <m.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  '&:hover': {
                    '& .category-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .category-icon': {
                      transform: 'translateY(-4px)',
                    },
                  },
                }}
              >
                <CardActionArea
                  component={RouterLink}
                  href={category.href}
                  sx={{ height: '100%', p: 3 }}
                >
                  <Stack spacing={2}>
                    <Box
                      className="category-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${category.color}20`,
                        transition: 'transform 0.3s',
                      }}
                    >
                      <Iconify icon={category.icon} width={32} sx={{ color: category.color }} />
                    </Box>

                    <Box>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {category.description}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                        Browse Products
                      </Typography>
                      <Iconify icon="solar:arrow-right-bold" width={16} />
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
