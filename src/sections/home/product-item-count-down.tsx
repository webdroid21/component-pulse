import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';
import type { Product } from 'src/types/product';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { ProductCountdownBlock } from './product-countdown-block';

// ----------------------------------------------------------------------

type Props = BoxProps & {
    sx?: SxProps<Theme>;
    product: Product;
};

export function ProductItemCountDown({ product, sx, ...other }: Props) {
    return (
        <Box
            sx={{
                p: 3,
                minWidth: 0,
                borderRadius: 2,
                color: 'primary.darker',
                bgcolor: 'primary.lighter',
                transition: (theme) =>
                    theme.transitions.create('background-color', {
                        easing: theme.transitions.easing.easeIn,
                        duration: theme.transitions.duration.shortest,
                    }),
                '&:hover': { bgcolor: 'primary.light' },
                ...sx,
            }}
            {...other}
        >
            <Box
                component="img"
                alt={product.name}
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
                sx={(theme) => ({
                    width: 1,
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: 1.5,
                    filter: `drop-shadow(20px 20px 24px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)})`,
                })}
            />

            <Box display="flex" flexDirection="column" sx={{ my: 3, textAlign: 'center' }}>
                <Link
                    component={RouterLink}
                    href={paths.product(product.slug || product.id)}
                    color="inherit"
                    underline="none"
                    variant="subtitle2"
                    noWrap
                    sx={{ mb: 1, opacity: 0.72 }}
                >
                    {product.name}
                </Link>

                <Typography variant="h5">{`From ${fCurrency(product.salePrice || product.price)}`}</Typography>
            </Box>

            <ProductCountdownBlock expired={new Date(Date.now() + 1000 * 60 * 60 * 24)} />
        </Box>
    );
}
