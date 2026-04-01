'use client';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCreateOrder, useUpdatePaymentStatus, useValidateCoupon } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

type CallbackState = 'loading' | 'success' | 'failed' | 'error';

export default function CheckoutCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = useCheckoutContext();
  const { createOrder } = useCreateOrder();
  const { updatePaymentStatus } = useUpdatePaymentStatus();
  const { incrementCouponUsage } = useValidateCoupon();

  const [state, setState] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  const processCallback = useCallback(async () => {
    if (processed) return;
    setProcessed(true);

    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');
    const notificationType = searchParams.get('OrderNotificationType');

    if (!orderTrackingId || !merchantReference || notificationType !== 'CALLBACKURL') {
      setState('error');
      setMessage('Invalid callback parameters. Please contact support.');
      return;
    }

    try {
      // Step 1: Verify payment status server-side
      const verifyRes = await fetch(
        `/api/payments/pesapal/verify?orderTrackingId=${orderTrackingId}`
      );
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || verifyData.error) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      const isPaid = verifyData.payment_status_description === 'Completed';

      if (!isPaid) {
        setState('failed');
        setMessage(
          `Payment was not completed. Status: ${verifyData.payment_status_description}. Please try again.`
        );
        return;
      }

      // Step 2: Restore pending order data from sessionStorage
      const pendingOrderRaw = sessionStorage.getItem('pp_pending_order');
      if (!pendingOrderRaw) {
        setState('error');
        setMessage(
          'Order data not found. If payment was deducted, contact support with reference: ' +
            merchantReference
        );
        return;
      }

      const pendingOrder = JSON.parse(pendingOrderRaw);

      // Step 3: Create the order in Firestore
      setMessage('Creating your order...');
      const orderData = {
        ...pendingOrder,
        paymentReference: merchantReference,
        paymentMethod: 'pesapal' as const,
        pesapalTrackingId: orderTrackingId,
      };

      const result = await createOrder(orderData);
      if (!result) {
        setState('error');
        setMessage(
          'Payment received but order creation failed. Please contact support with reference: ' +
            merchantReference
        );
        return;
      }

      // Step 4: Update payment status to paid
      await updatePaymentStatus(result.orderId, 'paid', merchantReference);

      // Step 5: Increment coupon if applied
      if (pendingOrder.appliedCouponId) {
        await incrementCouponUsage(pendingOrder.appliedCouponId);
      }

      // Step 5: Send confirmation email
      try {
        const pendingOrder = JSON.parse(pendingOrderRaw);
        await fetch('/api/orders/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: result.orderNumber,
            customerName: pendingOrder.customerName || '',
            customerEmail: pendingOrder.customerEmail || '',
            items: (pendingOrder.items || []).map((item: any) => ({
              productName: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
            subtotal: pendingOrder.subtotal || 0,
            deliveryFee: pendingOrder.deliveryFee || 0,
            discount: pendingOrder.discount || 0,
            total: pendingOrder.total || 0,
          }),
        });
      } catch (emailErr) {
        console.error('Confirmation email failed (non-critical):', emailErr);
      }

      // Step 6: Clear sessionStorage and cart
      sessionStorage.removeItem('pp_pending_order');
      checkout.onResetCart();

      setOrderId(result.orderId);
      setOrderNumber(result.orderNumber);
      setState('success');

      // Redirect to success page
      router.push(`/checkout/success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`);
    } catch (err: any) {
      console.error('Callback processing error:', err);
      setState('error');
      setMessage(err.message || 'An unexpected error occurred. Please contact support.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    processCallback();
  }, [processCallback]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      {state === 'loading' && (
        <Box>
          <CircularProgress size={72} sx={{ mb: 3 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Processing Payment
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {message}
          </Typography>
        </Box>
      )}

      {state === 'success' && (
        <Box>
          <Iconify
            icon="solar:check-circle-bold-duotone"
            width={80}
            sx={{ color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Redirecting you to your order confirmation...
          </Typography>
          {orderId && (
            <Button
              component={RouterLink}
              href={`/checkout/success?orderId=${orderId}&orderNumber=${orderNumber}`}
              variant="contained"
            >
              View Order
            </Button>
          )}
        </Box>
      )}

      {state === 'failed' && (
        <Box>
          <Iconify
            icon="solar:close-circle-bold-duotone"
            width={80}
            sx={{ color: 'error.main', mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Payment Failed
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {message}
          </Typography>
          <Button component={RouterLink} href={paths.checkout} variant="contained">
            Try Again
          </Button>
        </Box>
      )}

      {state === 'error' && (
        <Box>
          <Iconify
            icon="solar:danger-bold-duotone"
            width={80}
            sx={{ color: 'warning.main', mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {message}
          </Typography>
          <Button component={RouterLink} href={paths.checkout} variant="contained">
            Return to Checkout
          </Button>
        </Box>
      )}
    </Container>
  );
}
