'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProducts } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export function HomeFeaturedProducts() {
  const { products, loading } = useProducts({ isFeatured: true, limit: 8 });
  const checkout = useCheckoutContext();

  const handleAddToCart = (product: any) => {
    checkout.onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      coverUrl: product.images?.[0]?.url || '',
      quantity: 1,
      available: product.quantity || 10,
    });
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Featured Products
            </Typography>
            <Typography variant="h2" sx={{ mt: 1 }}>
              Best Sellers
            </Typography>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              component={RouterLink}
              href={paths.products}
              variant="outlined"
              endIcon={<Iconify icon="solar:arrow-right-bold" />}
            >
              View All
            </Button>
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
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
                  </CardContent>
                </Card>
              ))
            : products.slice(0, 8).map((product, index) => (
                <m.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        '& .product-image': {
                          transform: 'scale(1.05)',
                        },
                        '& .add-to-cart': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        className="product-image"
                        component="img"
                        height="200"
                        image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'}
                        alt={product.name}
                        sx={{ transition: 'transform 0.3s' }}
                      />

                      {product.salePrice && product.salePrice < product.price && (
                        <Chip
                          label={`-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%`}
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontWeight: 700,
                          }}
                        />
                      )}

                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
                        }}
                      >
                        <Iconify icon="solar:heart-bold" width={20} />
                      </IconButton>

                      <Button
                        className="add-to-cart"
                        variant="contained"
                        size="small"
                        startIcon={<Iconify icon="solar:cart-plus-bold" />}
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: '50%',
                          transform: 'translateX(-50%) translateY(20px)',
                          opacity: 0,
                          transition: 'all 0.3s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
                      >
                        {product.categoryName || 'Electronics'}
                      </Typography>

                      <Typography
                        component={RouterLink}
                        href={paths.product(product.slug || product.id)}
                        variant="subtitle1"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          mb: 1,
                          color: 'text.primary',
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        {product.salePrice && product.salePrice < product.price ? (
                          <>
                            <Typography variant="h6" sx={{ color: 'error.main' }}>
                              {fCurrency(product.salePrice)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                            >
                              {fCurrency(product.price)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="h6">
                            {fCurrency(product.price)}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </m.div>
              ))}
        </Box>
      </Container>
    </Box>
  );
}
