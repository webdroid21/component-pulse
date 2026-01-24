'use client';

import type { OrderStatus } from 'src/types/order';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useOrder } from 'src/hooks/firebase';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
type TimelineDotColor = 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  chipColor: ChipColor;
  dotColor: TimelineDotColor;
  icon: string;
}> = {
  pending: { label: 'Pending', chipColor: 'warning', dotColor: 'warning', icon: 'solar:clock-circle-bold' },
  confirmed: { label: 'Confirmed', chipColor: 'info', dotColor: 'info', icon: 'solar:check-circle-bold' },
  processing: { label: 'Processing', chipColor: 'info', dotColor: 'info', icon: 'solar:box-bold' },
  ready_for_pickup: { label: 'Ready for Pickup', chipColor: 'secondary', dotColor: 'secondary', icon: 'solar:bag-check-bold' },
  out_for_delivery: { label: 'Out for Delivery', chipColor: 'primary', dotColor: 'primary', icon: 'solar:delivery-bold' },
  delivered: { label: 'Delivered', chipColor: 'success', dotColor: 'success', icon: 'solar:verified-check-bold' },
  cancelled: { label: 'Cancelled', chipColor: 'error', dotColor: 'error', icon: 'solar:close-circle-bold' },
  refunded: { label: 'Refunded', chipColor: 'default', dotColor: 'grey', icon: 'solar:undo-left-bold' },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  flutterwave: 'Card (Flutterwave)',
  mobile_money: 'Mobile Money',
  cash_on_delivery: 'Cash on Delivery',
};

// ----------------------------------------------------------------------

type Props = {
  orderId: string;
};

export function AccountOrderDetailView({ orderId }: Props) {
  const { order, loading, error } = useOrder(orderId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Iconify icon="solar:file-corrupted-bold" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Order not found
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </Typography>
        <Button component={RouterLink} href={paths.account.orders} variant="contained">
          Back to Orders
        </Button>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="h5">Order #{order.orderNumber}</Typography>
              <Chip
                size="small"
                label={statusConfig.label}
                color={statusConfig.chipColor}
                icon={<Iconify icon={statusConfig.icon} width={16} />}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Placed on {order.createdAt ? fDateTime(order.createdAt.toDate()) : '-'}
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            href={paths.account.orders}
            variant="outlined"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
          >
            Back to Orders
          </Button>
        </Stack>
      </Card>

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Items
            </Typography>

            <Stack spacing={2} divider={<Divider />}>
              {order.items.map((item, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={item.productImage || '/assets/placeholder.png'}
                    alt={item.productName}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      objectFit: 'cover',
                      bgcolor: 'grey.100',
                    }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {item.productName}
                    </Typography>
                    {item.variantName && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.variantName}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fCurrency(item.unitPrice)} × {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">
                    {fCurrency(item.totalPrice)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Order Summary */}
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Subtotal
                </Typography>
                <Typography variant="body2">{fCurrency(order.subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Delivery Fee
                </Typography>
                <Typography variant="body2">
                  {order.deliveryFee === 0 ? 'FREE' : fCurrency(order.deliveryFee)}
                </Typography>
              </Stack>
              {order.discount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Discount
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    -{fCurrency(order.discount)}
                  </Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {fCurrency(order.total)}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Shipping Address */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Shipping Address
              </Typography>
              <Typography variant="body2">
                {order.shippingAddress.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {order.shippingAddress.city}
                {order.shippingAddress.district && `, ${order.shippingAddress.district}`}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {order.shippingAddress.phone}
              </Typography>
            </Card>

            {/* Payment Info */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Method
                  </Typography>
                  <Typography variant="body2">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Status
                  </Typography>
                  <Chip
                    size="small"
                    label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    color={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'}
                  />
                </Stack>
                {order.paymentReference && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Reference
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {order.paymentReference}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Card>

            {/* Order Timeline */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Timeline
              </Typography>
              <Timeline sx={{ p: 0, m: 0 }}>
                {order.statusHistory?.map((history, index) => {
                  const config = STATUS_CONFIG[history.status];
                  const isLast = index === order.statusHistory.length - 1;
                  
                  return (
                    <TimelineItem
                      key={index}
                      sx={{
                        '&::before': { display: 'none' },
                        minHeight: isLast ? 'auto' : 70,
                      }}
                    >
                      <TimelineSeparator>
                        <TimelineDot color={config?.dotColor || 'grey'} sx={{ m: 0 }}>
                          <Iconify icon={config?.icon || 'solar:record-bold'} width={16} />
                        </TimelineDot>
                        {!isLast && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: 0, pl: 2 }}>
                        <Typography variant="subtitle2">
                          {config?.label || history.status}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {history.timestamp?.toDate ? fDateTime(history.timestamp.toDate()) : '-'}
                        </Typography>
                        {history.note && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {history.note}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Order Notes */}
      {order.notes && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Notes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {order.notes}
          </Typography>
        </Card>
      )}
    </Stack>
  );
}
