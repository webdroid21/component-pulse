'use client';

import type { OrderStatus } from 'src/types/order';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCustomerOrders } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon: string;
  bgColor: string;
}> = {
  pending: { label: 'Pending', color: 'warning', icon: 'solar:clock-circle-bold', bgColor: 'warning.lighter' },
  confirmed: { label: 'Confirmed', color: 'info', icon: 'solar:check-circle-bold', bgColor: 'info.lighter' },
  processing: { label: 'Processing', color: 'info', icon: 'solar:box-bold', bgColor: 'info.lighter' },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'secondary', icon: 'solar:bag-check-bold', bgColor: 'secondary.lighter' },
  out_for_delivery: { label: 'Out for Delivery', color: 'primary', icon: 'solar:delivery-bold', bgColor: 'primary.lighter' },
  delivered: { label: 'Delivered', color: 'success', icon: 'solar:verified-check-bold', bgColor: 'success.lighter' },
  cancelled: { label: 'Cancelled', color: 'error', icon: 'solar:close-circle-bold', bgColor: 'error.lighter' },
  refunded: { label: 'Refunded', color: 'default', icon: 'solar:undo-left-bold', bgColor: 'grey.200' },
};

// ----------------------------------------------------------------------

export function AccountOrdersView() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { orders, loading, error } = useCustomerOrders(user?.uid || null);

  const handleViewOrder = (orderId: string) => {
    router.push(paths.account.order(orderId));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Iconify icon="solar:danger-triangle-bold" width={48} sx={{ color: 'error.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Failed to load orders
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please try again later or contact support if the problem persists.
        </Typography>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card sx={{ p: 5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Iconify icon="solar:bag-4-bold-duotone" width={40} sx={{ color: 'text.disabled' }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          No orders yet
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          When you place orders, they will appear here for you to track.
        </Typography>
        <Button
          component={RouterLink}
          href={paths.products}
          variant="contained"
          startIcon={<Iconify icon="solar:shop-bold" />}
        >
          Start Shopping
        </Button>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Order History ({orders.length})
        </Typography>
      </Box>

      <Stack spacing={2}>
        {orders.map((order) => {
          const statusConfig = STATUS_CONFIG[order.status];
          
          return (
            <Card
              key={order.id}
              sx={{
                p: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[8],
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => handleViewOrder(order.id)}
            >
              {/* Status Banner */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: statusConfig.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon={statusConfig.icon} width={18} sx={{ color: `${statusConfig.color}.main` }} />
                  <Typography variant="subtitle2" sx={{ color: `${statusConfig.color}.dark` }}>
                    {statusConfig.label}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {order.createdAt ? fDate(order.createdAt.toDate()) : '-'}
                </Typography>
              </Box>

              {/* Order Content */}
              <Box sx={{ p: 2 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {order.createdAt ? fDateTime(order.createdAt.toDate()) : '-'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    {fCurrency(order.total)}
                  </Typography>
                </Stack>

                {/* Items Preview */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, overflow: 'hidden' }}>
                  {order.items.slice(0, 4).map((item, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={item.productImage || '/assets/placeholder.png'}
                      alt={item.productName}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        objectFit: 'cover',
                        bgcolor: 'grey.100',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ))}
                  {order.items.length > 4 && (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        +{order.items.length - 4}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* Footer */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrder(order.id);
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
