'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDeals } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DealsView() {
  const { deals, loading } = useDeals({ isActive: true });

  return (
    <Box sx={{ pb: { xs: 8, md: 10 }, pt: { xs: 4, md: 8 } }}>
      <Container>
        <Stack spacing={2} sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h3">Special Combo Deals</Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Get the best value with our curated combination of products and training modules.
            Save more when you buy them together!
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : deals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Iconify icon="solar:box-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5">No active deals right now</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please check back later for special offers.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {deals.map((deal, index) => (
              <m.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  component={RouterLink}
                  href={paths.deals.details(deal.id)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.customShadows.z20,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Image
                      src={deal.coverImage || '/assets/placeholder.svg'}
                      alt={deal.name}
                      ratio="16/9"
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'error.main',
                        color: 'common.white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        typography: 'subtitle2',
                        fontWeight: 700,
                      }}
                    >
                      SAVE {fCurrency(deal.originalPrice - deal.price)}
                    </Box>
                  </Box>

                  <Stack spacing={2} sx={{ p: 3, flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>
                      {deal.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flexGrow: 1,
                      }}
                    >
                      {deal.description}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:box-bold-duotone" sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {deal.productIds.length} Products
                      </Typography>
                      {deal.trainingModuleIds.length > 0 && (
                        <>
                          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                          <Iconify icon="solar:book-bold-duotone" sx={{ color: 'secondary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {deal.trainingModuleIds.length} Modules
                          </Typography>
                        </>
                      )}
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          {fCurrency(deal.price)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                          {fCurrency(deal.originalPrice)}
                        </Typography>
                      </Stack>

                      <Button variant="contained" size="small" color="inherit">
                        View Deal
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </m.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
