'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDeals } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function HomeComboDeals() {
  const { deals } = useDeals({ isActive: true, limit: 3 });

  if (deals.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: { xs: 5, md: 8 } }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Special Combo Deals
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Bundle up and save big on electronics and training.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            href={paths.deals.root}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            color="inherit"
          >
            View All Deals
          </Button>
        </Stack>

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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" sx={{ color: 'primary.main' }}>
                        {fCurrency(deal.price)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        {fCurrency(deal.originalPrice)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
