import type { Theme, SxProps } from '@mui/material/styles';
import type { Product } from 'src/types/product';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    sx?: SxProps<Theme>;
    product: Product;
    variant?: 'small' | 'large';
};

export function ProductItemTop({ product, variant = 'small', sx }: Props) {
    const renderImage = (
        <Box
            component="img"
            alt={product.name}
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
            sx={{
                width: 1,
                aspectRatio: '1/1',
                objectFit: 'cover',
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
            }}
        />
    );

    const renderName = <Typography variant="h5" noWrap>{product.name}</Typography>;

    const priceText = (
        <Typography variant="h5" sx={{ color: 'text.disabled' }}>
            {fCurrency(product.salePrice || product.price)}
        </Typography>
    );

    const renderButton = (
        <Button
            component={RouterLink}
            href={paths.product(product.slug || product.id)}
            color="inherit"
            endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
            sx={{ flexShrink: 0 }}
        >
            More details
        </Button>
    );

    const renderLargeItem = (
        <Box gap={5} display="flex" flexDirection="column">
            {renderImage}

            <Box gap={5} display="flex" alignItems="flex-end">
                <Box display="flex" flexDirection="column" gap={1} flexGrow={1} sx={{ minWidth: 0 }}>
                    {renderName}
                    {priceText}
                </Box>
                {renderButton}
            </Box>
        </Box>
    );

    const renderSmallItem = (
        <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ height: 1 }}
        >
            <Box display="inline-flex" sx={{ order: { sm: 2 } }}>
                {renderImage}
            </Box>

            <Stack spacing={1} sx={{ minWidth: 0 }}>
                {renderName}
                {priceText}

                <Stack
                    flexGrow={1}
                    justifyContent="flex-end"
                    alignItems={{ xs: 'flex-end', sm: 'flex-start' }}
                >
                    {renderButton}
                </Stack>
            </Stack>
        </Box>
    );

    return (
        <Paper
            sx={{
                p: 5,
                borderRadius: 2,
                bgcolor: 'background.neutral',
                ...sx,
            }}
        >
            {variant === 'large' ? renderLargeItem : renderSmallItem}
        </Paper>
    );
}
