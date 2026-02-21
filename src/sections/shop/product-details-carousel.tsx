import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

type Props = {
    images: { url: string }[];
    productName: string;
};

export function ProductDetailsCarousel({ images, productName }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);

    const safeImages = images.length > 0
        ? images
        : [{ url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80' }];

    return (
        <Card sx={{ p: 2 }}>
            <Box
                sx={{
                    mb: 2,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src={safeImages[selectedImage]?.url}
                    alt={productName}
                    sx={{
                        width: '100%',
                        height: { xs: 300, md: 500 },
                        objectFit: 'contain',
                        bgcolor: 'grey.100',
                        transition: 'all 0.3s',
                    }}
                />
            </Box>

            {safeImages.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {safeImages.map((image, index) => (
                        <Box
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            sx={{
                                width: 80,
                                height: 80,
                                flexShrink: 0,
                                borderRadius: 1,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: 2,
                                borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <Box
                                component="img"
                                src={image.url}
                                alt={`${productName} thumbnail`}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    ))}
                </Stack>
            )}
        </Card>
    );
}
