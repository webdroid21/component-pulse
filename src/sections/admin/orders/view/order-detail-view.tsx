'use client';

import type { OrderStatus } from 'src/types/order';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TimelineDot from '@mui/lab/TimelineDot';
import TextField from '@mui/material/TextField';
import TimelineItem from '@mui/lab/TimelineItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useOrder, useOrderMutations, useUpdatePaymentStatus, useNotificationMutations } from 'src/hooks/firebase';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

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

export function OrderDetailView({ orderId }: Props) {
  const { order, loading, error } = useOrder(orderId);
  const { updateOrderStatus, addOrderNote, loading: updating } = useOrderMutations();
  const { createNotification } = useNotificationMutations();
  const { updatePaymentStatus, loading: updatingPayment } = useUpdatePaymentStatus();

  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;

    const success = await updateOrderStatus(order.id, newStatus, statusNote);
    if (success) {
      // --- In-app notification for customer ---
      if (order.customerId) {
        const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
        try {
          await createNotification({
            userId: order.customerId,
            type: 'order',
            category: 'Order Update',
            title: `Order <strong>#${order.orderNumber}</strong> is now <strong>${statusLabel}</strong>${statusNote ? ` — ${statusNote}` : ''}`,
            avatarUrl: null,
            link: `/account/orders/${order.id}`,
          });
        } catch (err) {
          console.error('Failed to create in-app notification:', err);
        }
      }

      // --- Email notification ---
      try {
        await fetch('/api/orders/send-status-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            newStatus,
            statusNote,
            items: order.items.map(item => ({ id: item.productId, name: item.productName }))
          }),
        });
      } catch (err) {
        console.error('Failed to send status update email:', err);
      }

      setNewStatus('');
      setStatusNote('');
    }
  };

  const handleAddNote = async () => {
    if (!adminNote.trim() || !order) return;

    const success = await addOrderNote(order.id, adminNote);
    if (success) {
      setAdminNote('');
      // No refetch needed — real-time listener updates order automatically
    }
  };

  const handlePaymentUpdate = async () => {
    if (!order) return;
    const success = await updatePaymentStatus(order.id, 'paid', paymentReference);
    if (success) {
      toast.success('Payment status marked as paid!');
      setPaymentReference('');
    } else {
      toast.error('Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !order) {
    return (
      <DashboardContent>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Iconify icon="solar:file-corrupted-bold" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order not found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            The order you&apos;re looking for doesn&apos;t exist.
          </Typography>
          <Button component={RouterLink} href={paths.admin.orders.root} variant="contained">
            Back to Orders
          </Button>
        </Card>
      </DashboardContent>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <DashboardContent>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }} flexWrap="wrap" gap={2}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
            <Typography variant="h4">Order #{order.orderNumber}</Typography>
            <Chip
              label={statusConfig.label}
              color={statusConfig.chipColor}
              icon={<Iconify icon={statusConfig.icon} width={18} />}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Placed on {order.createdAt ? fDateTime(order.createdAt.toDate()) : '-'}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          href={paths.admin.orders.root}
          variant="outlined"
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
        >
          Back to Orders
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* Order Items */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order Items ({order.items.length})
              </Typography>

              <Stack spacing={2} divider={<Divider />}>
                {order.items.map((item, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={item.productImage || '/assets/placeholder.png'}
                      alt={item.productName}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        objectFit: 'cover',
                        bgcolor: 'grey.100',
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2">{item.productName}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        SKU: {item.sku}
                      </Typography>
                      {item.variantName && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Variant: {item.variantName}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        {fCurrency(item.unitPrice)} × {item.quantity}
                      </Typography>
                      <Typography variant="subtitle2">
                        {fCurrency(item.totalPrice)}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Order Summary */}
              <Stack spacing={1.5} sx={{ maxWidth: 300, ml: 'auto' }}>
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
                      Discount {order.couponCode && `(${order.couponCode})`}
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

            {/* Update Status */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Update Order Status
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>New Status</InputLabel>
                    <Select
                      value={newStatus}
                      label="New Status"
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.value === order.status}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    label="Status Note (Optional)"
                    placeholder="Add a note about this status change..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || updating}
                    startIcon={updating ? <CircularProgress size={20} /> : <Iconify icon="solar:check-circle-bold" />}
                  >
                    {updating ? 'Updating...' : 'Update Status & Notify Customer'}
                  </Button>
                </Grid>
              </Grid>
            </Card>

            {/* Admin Notes */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Admin Notes
              </Typography>

              {order.adminNotes && (
                <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 2, mb: 2 }}>
                  <Typography variant="body2">{order.adminNotes}</Typography>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add internal notes about this order..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddNote}
                  disabled={!adminNote.trim() || updating}
                  sx={{ minWidth: 100 }}
                >
                  Save
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Customer Info */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer
              </Typography>
              <Stack spacing={1}>
                <Typography variant="subtitle2">{order.customerName}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:letter-bold" width={18} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">{order.customerEmail}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:phone-bold" width={18} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">{order.customerPhone}</Typography>
                </Stack>
              </Stack>
            </Card>

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
              {order.shippingAddress.deliveryInstructions && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'warning.lighter', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Delivery Instructions:
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.deliveryInstructions}
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Payment Info */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Method
                  </Typography>
                  <Typography variant="body2">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {order.paymentReference}
                    </Typography>
                  </Stack>
                )}

                {order.paymentMethod === 'cash_on_delivery' && order.paymentStatus === 'pending' && (
                  <>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Mark as Paid</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="Payment Ref/Receipt No. (Optional)"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handlePaymentUpdate}
                        disabled={updatingPayment}
                        startIcon={updatingPayment ? <CircularProgress size={16} /> : <Iconify icon="solar:check-circle-bold" />}
                      >
                        Confirm Payment
                      </Button>
                    </Stack>
                  </>
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
                        {history.updatedBy && (
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            by {history.updatedBy}
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
    </DashboardContent>
  );
}
