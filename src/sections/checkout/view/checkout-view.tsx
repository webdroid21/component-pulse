'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Divider from '@mui/material/Divider';
import StepLabel from '@mui/material/StepLabel';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from '../context';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    label: 'Free Delivery',
    description: 'Delivered in 3-5 business days',
  },
  {
    value: 15000,
    label: 'Express Delivery',
    description: 'Delivered in 1-2 business days',
  },
  {
    value: 25000,
    label: 'Same Day Delivery',
    description: 'Delivered today (Kampala only)',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'flutterwave',
    label: 'Pay with Flutterwave',
    description: 'Card, Mobile Money, Bank Transfer',
    icon: 'solar:card-bold-duotone',
  },
  {
    value: 'mobile_money',
    label: 'Mobile Money',
    description: 'MTN, Airtel Money',
    icon: 'solar:smartphone-bold-duotone',
  },
  {
    value: 'cash',
    label: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: 'solar:money-bag-bold-duotone',
  },
];

export function CheckoutView() {
  const checkout = useCheckoutContext();

  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: '',
  });
  const [deliveryOption, setDeliveryOption] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');
  const [loading, setLoading] = useState(false);

  const { items, subtotal, discount } = checkout.state;
  const shipping = deliveryOption;
  const total = subtotal - discount + shipping;

  const steps = ['Shipping', 'Delivery', 'Payment'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    if (paymentMethod === 'flutterwave') {
      // Initialize Flutterwave payment
      initializeFlutterwavePayment();
    } else {
      // Handle other payment methods
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to success page
      window.location.href = `${paths.checkout}?step=3`;
    }

    setLoading(false);
  };

  const initializeFlutterwavePayment = () => {
    // Flutterwave payment integration placeholder
    // This will be implemented with actual Flutterwave SDK
    const paymentConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-PLACEHOLDER',
      tx_ref: `CP-${Date.now()}`,
      amount: total,
      currency: 'UGX',
      payment_options: 'card,mobilemoneyuganda,banktransfer',
      customer: {
        email: shippingInfo.email,
        phone_number: shippingInfo.phone,
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      },
      customizations: {
        title: 'ComponentPulse',
        description: 'Payment for order',
        logo: 'https://componentpulse.com/logo.png',
      },
    };

    // For now, show alert - actual implementation will use Flutterwave SDK
    alert(`Flutterwave payment would be initiated with amount: ${fCurrency(total)}\n\nTo complete integration, add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY to your environment variables.`);
    console.log('Payment config:', paymentConfig);
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
          Add some products to your cart before checking out.
        </Typography>
        <Button
          component={RouterLink}
          href={paths.products}
          variant="contained"
          size="large"
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const renderShippingStep = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Shipping Information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleShippingChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleShippingChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={shippingInfo.email}
            onChange={handleShippingChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            required
            placeholder="+256..."
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            required
            placeholder="Street address, building, floor..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={shippingInfo.city}
            onChange={handleShippingChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="District"
            name="district"
            value={shippingInfo.district}
            onChange={handleShippingChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Order Notes (Optional)"
            name="notes"
            value={shippingInfo.notes}
            onChange={handleShippingChange}
            placeholder="Special instructions for delivery..."
          />
        </Grid>
      </Grid>
    </Card>
  );

  const renderDeliveryStep = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Delivery Options
      </Typography>

      <RadioGroup
        value={deliveryOption}
        onChange={(e) => setDeliveryOption(Number(e.target.value))}
      >
        <Stack spacing={2}>
          {DELIVERY_OPTIONS.map((option) => (
            <Card
              key={option.value}
              sx={{
                p: 2.5,
                cursor: 'pointer',
                border: 2,
                borderColor: deliveryOption === option.value ? 'primary.main' : 'divider',
                bgcolor: deliveryOption === option.value ? 'primary.lighter' : 'transparent',
              }}
              onClick={() => setDeliveryOption(option.value)}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1">{option.label}</Typography>
                      <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                        {option.value === 0 ? 'FREE' : fCurrency(option.value)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {option.description}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Card>
          ))}
        </Stack>
      </RadioGroup>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Payment Method
      </Typography>

      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <Stack spacing={2}>
          {PAYMENT_OPTIONS.map((option) => (
            <Card
              key={option.value}
              sx={{
                p: 2.5,
                cursor: 'pointer',
                border: 2,
                borderColor: paymentMethod === option.value ? 'primary.main' : 'divider',
                bgcolor: paymentMethod === option.value ? 'primary.lighter' : 'transparent',
              }}
              onClick={() => setPaymentMethod(option.value)}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                      }}
                    >
                      <Iconify icon={option.icon} width={24} sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">{option.label}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Card>
          ))}
        </Stack>
      </RadioGroup>

      {paymentMethod === 'flutterwave' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          You will be redirected to Flutterwave&apos;s secure payment page to complete your payment.
        </Alert>
      )}

      {paymentMethod === 'cash' && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Cash on Delivery is only available within Kampala. An additional UGX 5,000 handling fee may apply.
        </Alert>
      )}
    </Card>
  );

  const renderOrderSummary = () => (
    <Card sx={{ p: 3, position: 'sticky', top: 24 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Order Summary
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {items.map((item) => (
          <Stack key={item.id} direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              src={item.coverUrl || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=80&q=80'}
              alt={item.name}
              sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Qty: {item.quantity}
              </Typography>
            </Box>
            <Typography variant="body2">
              {fCurrency(item.price * item.quantity)}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Subtotal
          </Typography>
          <Typography variant="body2">{fCurrency(subtotal)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Shipping
          </Typography>
          <Typography variant="body2">
            {shipping === 0 ? 'FREE' : fCurrency(shipping)}
          </Typography>
        </Stack>

        {discount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              -{fCurrency(discount)}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            {fCurrency(total)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {activeStep === 0 && renderShippingStep()}
            {activeStep === 1 && renderDeliveryStep()}
            {activeStep === 2 && renderPaymentStep()}

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<Iconify icon="solar:arrow-left-bold" />}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                endIcon={
                  activeStep === steps.length - 1 ? (
                    <Iconify icon="solar:card-bold" />
                  ) : (
                    <Iconify icon="solar:arrow-right-bold" />
                  )
                }
              >
                {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {renderOrderSummary()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
