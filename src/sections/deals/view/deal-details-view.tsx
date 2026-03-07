'use client';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDeal, useProducts, useTrainingModules } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCheckoutContext } from 'src/sections/checkout/context';
import { ProductReviews } from 'src/sections/shop/product-reviews';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function DealDetailsView({ id }: Props) {
  const { deal, loading } = useDeal(id);
  const { products } = useProducts();
  const { modules } = useTrainingModules();

  const checkout = useCheckoutContext();

  const handleAddCart = () => {
    if (!deal) return;
    try {
      checkout.onAddToCart({
        id: deal.id,
        name: `Combo Deal: ${deal.name}`,
        price: deal.price,
        coverUrl: deal.coverImage || '/assets/placeholder.svg',
        available: 99,
        quantity: 1,
      });
      toast.success('Deal added to cart');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!deal) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Iconify icon="solar:box-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          Deal not found
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          The deal you&apos;re looking for doesn&apos;t exist or has been removed.
        </Typography>
        <Button component={RouterLink} href={paths.deals.root} variant="contained">
          Browse Deals
        </Button>
      </Container>
    );
  }

  const includedProducts = products.filter((p) => deal.productIds.includes(p.id));
  const includedModules = modules.filter((m) => deal.trainingModuleIds.includes(m.id));

  return (
    <Container sx={{ pt: 5, pb: 10 }}>
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Deals', href: paths.deals.root },
          { name: deal.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <Card>
            <Image alt={deal.name} src={deal.coverImage || '/assets/placeholder.svg'} ratio="16/9" />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Stack spacing={3}>
            <Box>
              <Box sx={{ mb: 2, display: 'inline-block', bgcolor: 'error.main', color: 'common.white', px: 1.5, py: 0.5, borderRadius: 1, typography: 'subtitle2', fontWeight: 700 }}>
                SAVE {fCurrency(deal.originalPrice - deal.price)}
              </Box>
              <Typography variant="h4" sx={{ mb: 2 }}>{deal.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {deal.description}
              </Typography>
            </Box>

            <Divider />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3">{fCurrency(deal.price)}</Typography>
              <Typography variant="h5" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(deal.originalPrice)}
              </Typography>
            </Stack>

            <Button
              size="large"
              color="warning"
              variant="contained"
              startIcon={<Iconify icon="solar:cart-plus-bold" />}
              onClick={handleAddCart}
              sx={{ py: 1.5 }}
            >
              Add Deal to Cart
            </Button>

            <Divider />

            <Typography variant="subtitle2">What&apos;s Included:</Typography>
            <Stack spacing={2}>
              {includedProducts.map((product) => (
                <Stack key={product.id} direction="row" alignItems="center" spacing={2}>
                  <Box
                    component="img"
                    src={product.images?.[0]?.url || '/assets/placeholder.svg'}
                    sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" component={RouterLink} href={paths.product(product.id)} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fCurrency(product.price)}
                    </Typography>
                  </Box>
                </Stack>
              ))}

              {includedModules.map((mod) => (
                <Stack key={mod.id} direction="row" alignItems="center" spacing={2}>
                  <Box
                    component="img"
                    src={mod.coverImage || '/assets/placeholder.svg'}
                    sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" component={RouterLink} href={paths.trainingModules.details(mod.id)} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                      Training: {mod.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {mod.isFree ? 'Free' : fCurrency(mod.price)}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>

          </Stack>
        </Grid>
      </Grid>

      <Card sx={{ mt: 8, p: { xs: 3, md: 5 } }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Deal Details
        </Typography>
        <Markdown children={deal.content} />
      </Card>

      <Card sx={{ mt: 8 }}>
        <ProductReviews productId={deal.id} />
      </Card>
    </Container>
  );
}
