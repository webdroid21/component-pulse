'use client';

import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const orderId = searchParams.get('orderId');

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'success.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Iconify
              icon="solar:check-circle-bold"
              width={60}
              sx={{ color: 'success.main' }}
            />
          </Box>

          <Typography variant="h4" sx={{ mb: 2 }}>
            Order Confirmed!
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Thank you for your order. We&apos;ve received your order and will begin processing it soon.
          </Typography>

          {orderNumber && (
            <Box
              sx={{
                bgcolor: 'grey.100',
                borderRadius: 2,
                p: 2,
                mb: 4,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Order Number
              </Typography>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                #{orderNumber}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            A confirmation email has been sent to your email address with the order details.
          </Typography>

          <Stack spacing={2}>
            <Button
              component={RouterLink}
              href={orderId ? paths.account.order(orderId) : paths.account.orders}
              variant="contained"
              size="large"
              startIcon={<Iconify icon="solar:bag-check-bold" />}
            >
              View Order
            </Button>

            <Button
              component={RouterLink}
              href={paths.products}
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="solar:shop-bold" />}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Need help?{' '}
            <RouterLink href={paths.contact} style={{ color: 'inherit', fontWeight: 'bold' }}>
              Contact our support team
            </RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
