'use client';

import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

const FEATURES = [
    {
        title: 'Structured Learning',
        description: 'Progressive curriculum that builds knowledge step by step, from basics to advanced concepts.',
        icon: 'solar:book-bookmark-bold-duotone',
        color: 'info',
    },
    {
        title: 'Hands-on Projects',
        description: 'Build real embedded systems projects using industry-standard tools and components.',
        icon: 'solar:laptop-minimalistic-bold-duotone',
        color: 'success',
    },
    {
        title: 'Expert Instructors',
        description: 'Learn from experienced engineers with years of industry experience and practical knowledge.',
        icon: 'solar:users-group-rounded-bold-duotone',
        color: 'secondary',
    },
    {
        title: 'Industry Certification',
        description: 'Receive recognized certificates that demonstrate your skills to potential employers.',
        icon: 'solar:diploma-verified-bold-duotone',
        color: 'warning',
    },
    {
        title: 'Career Support',
        description: 'Get guidance on career paths, portfolio building, and job opportunities in the field.',
        icon: 'solar:suitcase-bold-duotone',
        color: 'error',
    },
    {
        title: 'Flexible Learning',
        description: 'Choose between in-person, online, or hybrid learning formats that fit your schedule.',
        icon: 'solar:clock-circle-bold-duotone',
        color: 'primary',
    },
];

export function EmbeddedSystemsFeatures({ sx, ...other }: BoxProps) {

    const carousel = useCarousel({
        slidesToShow: { xs: 1, sm: 2, md: 3 },
        slideSpacing: '24px',
    });

    return (
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'background.default', ...sx }} {...other}>
            <Container>
                <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>
                        What to Expect from Our Training
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto' }}>
                        Our comprehensive training program is designed to take you from beginner to
                        professional embedded systems developer with real-world experience.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <CarouselArrowBasicButtons
                        {...carousel.arrows}
                        options={carousel.options}
                        sx={{
                            top: -64,
                            justifyContent: 'flex-end',
                            width: '100%',
                            display: { xs: 'none', md: 'inline-flex' },
                        }}
                    />

                    <Carousel carousel={carousel}>
                        {FEATURES.map((item) => (
                            <FeatureItem key={item.title} item={item} />
                        ))}
                    </Carousel>
                </Box>
            </Container>
        </Box>
    );
}

// ----------------------------------------------------------------------

type FeatureItemProps = {
    item: {
        title: string;
        description: string;
        icon: string;
        color: string;
    };
};

function FeatureItem({ item }: FeatureItemProps) {
    return (
        <Card
            sx={{
                p: 5,
                textAlign: 'center',
                boxShadow: (theme) => theme.customShadows.z8,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: `${item.color}.main`,
                    bgcolor: (theme) => theme.vars.palette[item.color as 'primary' | 'info' | 'success' | 'warning' | 'error'].lighter,
                }}
            >
                <Iconify icon={item.icon} width={40} />
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
            </Typography>
        </Card>
    );
}
