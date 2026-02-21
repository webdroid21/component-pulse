'use client';

import AutoScroll from 'embla-carousel-auto-scroll';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselDotButtons, CarouselArrowBasicButtons } from 'src/components/carousel';

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
    content: "The best prices in Kampala! I've compared with many suppliers and ComponentPulse consistently offers better deals without compromising on quality. Their customer service is excellent too.",
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

// ----------------------------------------------------------------------

type TestimonialCardProps = (typeof TESTIMONIALS)[number];

function TestimonialCard({ name, role, avatar, rating, content }: TestimonialCardProps) {
  return (
    <Card
      sx={{
        p: 3,
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
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Iconify
          icon="solar:quote-up-square-bold"
          width={32}
          sx={{ color: 'primary.main', opacity: 0.5 }}
        />

        <Typography variant="body2" sx={{ color: 'grey.300', lineHeight: 1.8, flexGrow: 1 }}>
          &ldquo;{content}&rdquo;
        </Typography>

        <Rating value={rating} readOnly size="small" />

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar src={avatar} alt={name} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'common.white' }}>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.500' }}>
              {role}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function HomeTestimonials() {
  const carousel = useCarousel(
    {
      loop: true,
      align: 'start',
      slidesToShow: { xs: 1.1, sm: 2.1, md: 3.1 },
      slideSpacing: '16px',
    },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.900', color: 'common.white', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Testimonials
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: 1.5, color: 'common.white' }}>
              What Our Customers Say
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.400', maxWidth: 500, mx: 'auto' }}>
              Here&apos;s what our satisfied customers have to say about us.
            </Typography>
          </Box>
        </m.div>

        <Carousel carousel={carousel}>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Carousel>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <CarouselArrowBasicButtons
            {...carousel.arrows}
            options={carousel.options}
            sx={{ color: 'common.white' }}
          />
          <CarouselDotButtons
            scrollSnaps={carousel.dots.scrollSnaps}
            selectedIndex={carousel.dots.selectedIndex}
            onClickDot={carousel.dots.onClickDot}
            sx={{ color: 'primary.main' }}
          />
        </Box>
      </Container>
    </Box>
  );
}
