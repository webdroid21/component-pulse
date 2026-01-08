'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export function CartView() {
  const checkout = useCheckoutContext();

  const { items, subtotal, shipping, discount, total } = checkout.state;

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      checkout.onDeleteCartItem(itemId);
    } else {
      checkout.onChangeItemQuantity(itemId, quantity);
    }
  };

  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Iconify icon="solar:cart-large-2-bold-duotone" width={100} sx={{ color: 'text.disabled', mb: 3 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Looks like you haven&apos;t added any products to your cart yet.
        </Typography>
        <Button
          component={RouterLink}
          href={paths.products}
          variant="contained"
          size="large"
          startIcon={<Iconify icon="solar:bag-5-bold" />}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          }}
        >
          {/* Cart Items */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            component="img"
                            src={item.coverUrl || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&q=80'}
                            alt={item.name}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1.5,
                              objectFit: 'cover',
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {fCurrency(item.price)} each
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center">
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Iconify icon="solar:minus-circle-bold" width={20} />
                          </IconButton>
                          <Typography sx={{ mx: 1.5, minWidth: 24, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.available}
                          >
                            <Iconify icon="solar:add-circle-bold" width={20} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {fCurrency(item.price * item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => checkout.onDeleteCartItem(item.id)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Order Summary */}
          <Card sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Summary
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Subtotal
                </Typography>
                <Typography variant="subtitle2">
                  {fCurrency(subtotal)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Shipping
                </Typography>
                <Typography variant="subtitle2">
                  {shipping === 0 ? 'Calculated at checkout' : fCurrency(shipping)}
                </Typography>
              </Stack>

              {discount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Discount
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                    -{fCurrency(discount)}
                  </Typography>
                </Stack>
              )}

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h5" sx={{ color: 'primary.main' }}>
                  {fCurrency(total || subtotal)}
                </Typography>
              </Stack>
            </Stack>

            {/* Coupon Code */}
            <Box sx={{ mt: 3, mb: 3 }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Coupon code"
                />
                <Button variant="outlined">Apply</Button>
              </Stack>
            </Box>

            <Button
              component={RouterLink}
              href={paths.checkout}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Iconify icon="solar:cart-check-bold" />}
            >
              Proceed to Checkout
            </Button>

            <Button
              component={RouterLink}
              href={paths.products}
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>

            {/* Trust badges */}
            <Stack spacing={1.5} sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              {[
                { icon: 'solar:shield-check-bold', text: 'Secure checkout' },
                { icon: 'solar:delivery-bold', text: 'Free shipping over UGX 500,000' },
                { icon: 'solar:refresh-bold', text: '7-day return policy' },
              ].map((badge) => (
                <Stack key={badge.text} direction="row" alignItems="center" spacing={1}>
                  <Iconify icon={badge.icon} width={18} sx={{ color: 'success.main' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {badge.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
