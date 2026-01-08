'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TESTIMONIALS = [
  {
    name: 'Robert Kizza',
    role: 'Solar Installer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    content: 'ComponentPulse has been my go-to supplier for all solar equipment. Their quality is unmatched and delivery is always on time. Highly recommend for anyone in the solar business!',
  },
  {
    name: 'Sarah Namukasa',
    role: 'Electrical Contractor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    content: 'The best prices in Kampala! I\'ve compared with many suppliers and ComponentPulse consistently offers better deals without compromising on quality. Their customer service is excellent too.',
  },
  {
    name: 'James Okello',
    role: 'Home Owner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    content: 'Bought my entire home solar system from here. The technical team helped me choose the right components and even provided installation guidance. My electricity bills are now zero!',
  },
  {
    name: 'Grace Akello',
    role: 'Business Owner',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    content: 'As a business owner, reliable power is crucial. ComponentPulse supplied our backup power system and it has been working flawlessly for over 2 years now.',
  },
  {
    name: 'David Mugisha',
    role: 'IT Technician',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5,
    content: 'Great selection of electronic components. Found everything I needed for my projects. The staff is knowledgeable and helped me find compatible parts.',
  },
  {
    name: 'Patricia Nakato',
    role: 'Farm Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    rating: 5,
    content: 'Installed solar pumps for our irrigation system. ComponentPulse provided excellent products and after-sales support. Our farm productivity has increased significantly.',
  },
];

export function HomeTestimonials() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.900', color: 'common.white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Testimonials
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, color: 'common.white' }}>
              What Our Customers Say
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.400', maxWidth: 600, mx: 'auto' }}>
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about us.
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
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <m.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'grey.800',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    bgcolor: 'primary.main',
                    borderRadius: '4px 0 0 4px',
                  },
                }}
              >
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Iconify icon="solar:quote-up-square-bold" width={40} sx={{ color: 'primary.main', opacity: 0.5 }} />
                  </Box>

                  <Typography variant="body1" sx={{ color: 'grey.300', lineHeight: 1.8 }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </Typography>

                  <Rating value={testimonial.rating} readOnly size="small" />

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
