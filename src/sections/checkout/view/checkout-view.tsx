'use client';

import type { UserAddress } from 'src/types/user';
import type { PaymentMethod } from 'src/types/order';

import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import StepLabel from '@mui/material/StepLabel';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useCreateOrder,
  useUserProfile,
  useDeliveryZones,
  useValidateCoupon,
  usePickupLocations,
  useUpdatePaymentStatus,
} from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { FIRESTORE } from 'src/lib/firebase';
import { generateMerchantRef } from 'src/lib/pesapal';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { useCheckoutContext } from '../context';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'pesapal',
    label: 'Pay Online',
    description: 'Card, Mobile Money, Bank Transfer via Pesapal',
    icon: 'solar:card-bold-duotone',
  },
  {
    value: 'cash_on_delivery',
    label: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: 'solar:money-bag-bold-duotone',
  },
];

export function CheckoutView() {
  const router = useRouter();
  const checkout = useCheckoutContext();
  const { user, authenticated } = useAuthContext();
  const { profile } = useUserProfile();
  const { createOrder, loading: creatingOrder, error: orderError } = useCreateOrder();
  const { updatePaymentStatus } = useUpdatePaymentStatus();
  const { zones, loading: zonesLoading } = useDeliveryZones(true); // active zones only
  const {
    validateCoupon,
    incrementCouponUsage,
    validating: couponValidating,
  } = useValidateCoupon();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: '',
  });
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState<string>('');
  const { locations: pickupLocations, loading: pickupLoading } = usePickupLocations();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pesapal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const savedAddresses = useMemo(() => profile?.addresses || [], [profile?.addresses]);

  const defaultAddressId = profile?.defaultAddressId;

  // Sync email from auth whenever user resolves (auth may load after component mounts)
  useEffect(() => {
    if (user?.email) {
      setShippingInfo((prev) => ({ ...prev, email: prev.email || user.email || '' }));
    }
  }, [user?.email]);

  // Auto-select default address on load
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId && !useNewAddress) {
      const defaultAddr = savedAddresses.find((addr) => addr.id === defaultAddressId);
      setSelectedAddressId(defaultAddr?.id || savedAddresses[0].id);
    }
  }, [savedAddresses, defaultAddressId, selectedAddressId, useNewAddress]);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;
  const shipping = deliveryMethod === 'delivery' ? (selectedZone?.fee ?? 0) : 0;

  const { items, subtotal, discount: cartDiscount } = checkout.state;

  // Dynamic Component Level Coupon Computations preventing "Static Exploit" overlaps
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const discount = cartDiscount + couponDiscount;
  const total = subtotal - discount + shipping;

  // Real-Time Listener unhooking Coupons when Subtotals drop below Limit
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      setAppliedCoupon(null);
      setCouponError(
        `Coupon removed: Minimum order amount of UGX ${appliedCoupon.minOrderAmount.toLocaleString()} required`
      );
    }
  }, [subtotal, appliedCoupon]);

  const steps = ['Shipping', 'Delivery', 'Payment'];

  const getSelectedAddress = (): UserAddress | null => {
    if (useNewAddress || !selectedAddressId) return null;
    return savedAddresses.find((addr) => addr.id === selectedAddressId) || null;
  };

  const checkValidationSilently = (): boolean => {
    if (!useNewAddress && savedAddresses.length > 0) {
      if (!selectedAddressId) return false;
      if (
        !shippingInfo.email.trim() ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(shippingInfo.email)
      )
        return false;
      return true;
    }

    const phoneRegex = /^(0|\+?256)[1-9][0-9]{7,12}$/;
    const cleanPhone = shippingInfo.phone.trim().replace(/\s/g, '');

    if (!shippingInfo.firstName.trim() || shippingInfo.firstName.trim().length < 2) return false;
    if (!shippingInfo.lastName.trim() || shippingInfo.lastName.trim().length < 2) return false;
    if (
      !shippingInfo.email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(shippingInfo.email)
    )
      return false;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) return false;
    if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 5) return false;
    if (!shippingInfo.city.trim()) return false;

    return true;
  };

  const validateShippingInfo = (): boolean => {
    // If using saved address, check if one is selected
    if (!useNewAddress && savedAddresses.length > 0) {
      if (!selectedAddressId) {
        setError('Please select a delivery address');
        return false;
      }
      if (
        !shippingInfo.email.trim() ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(shippingInfo.email)
      ) {
        setError('A valid email is required');
        return false;
      }
      setError(null);
      return true;
    }

    const phoneRegex = /^(0|\+?256)[1-9][0-9]{7,12}$/;
    const cleanPhone = shippingInfo.phone.trim().replace(/\s/g, '');

    // Validate new address form
    if (!shippingInfo.firstName.trim() || shippingInfo.firstName.trim().length < 2) {
      setError('Valid first name is required');
      return false;
    }
    if (!shippingInfo.lastName.trim() || shippingInfo.lastName.trim().length < 2) {
      setError('Valid last name is required');
      return false;
    }
    if (
      !shippingInfo.email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(shippingInfo.email)
    ) {
      setError('A valid email address is required');
      return false;
    }
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setError('Valid phone number is required (e.g. +256 700...)');
      return false;
    }
    if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 5) {
      setError('A complete physical address is required (min 5 chars)');
      return false;
    }
    if (!shippingInfo.city.trim()) {
      setError('City is required');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingInfo()) {
      return;
    }
    if (activeStep === 1) {
      if (deliveryMethod === 'pickup' && !selectedPickupId) {
        setError('Please select a pick-up location');
        return;
      }
      if (deliveryMethod === 'pickup' && !pickupDate) {
        setError('Please select a preferred pick-up date');
        return;
      }
      setError(null);
    }
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
    setError(null);
  };

  // Auto-select first zone when zones load
  useEffect(() => {
    if (zones.length > 0 && !selectedZoneId) {
      setSelectedZoneId(zones[0].id);
    }
  }, [zones, selectedZoneId]);

  const handleApplyCoupon = async () => {
    setCouponError(null);
    const { coupon, error: err } = await validateCoupon(couponInput, subtotal);
    if (err || !coupon) {
      setCouponError(err || 'Invalid coupon');
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
    });
    setCouponError(null);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  // Helper: remove undefined/empty optional fields so Firestore doesn't reject them
  const stripUndefined = (obj: Record<string, any>): Record<string, any> =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''));

  const buildOrderData = () => {
    const selectedAddr = getSelectedAddress();

    // Build shipping address — conditionally include optional fields to avoid undefined
    const rawAddress = selectedAddr
      ? {
          fullName: selectedAddr.fullName,
          phone: selectedAddr.phone,
          email: shippingInfo.email,
          addressLine1: selectedAddr.addressLine1,
          city: selectedAddr.city,
          country: selectedAddr.country || 'Uganda',
          ...(selectedAddr.addressLine2 ? { addressLine2: selectedAddr.addressLine2 } : {}),
          ...(selectedAddr.district ? { district: selectedAddr.district } : {}),
          ...(selectedAddr.deliveryInstructions || shippingInfo.notes
            ? { deliveryInstructions: selectedAddr.deliveryInstructions || shippingInfo.notes }
            : {}),
        }
      : {
          fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          addressLine1: shippingInfo.address,
          city: shippingInfo.city,
          country: 'Uganda',
          ...(shippingInfo.district ? { district: shippingInfo.district } : {}),
          ...(shippingInfo.notes ? { deliveryInstructions: shippingInfo.notes } : {}),
        };

    const shippingAddress = stripUndefined(rawAddress);

    return {
      customerId: user?.uid || '',
      customerName: selectedAddr?.fullName || `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerEmail: shippingInfo.email,
      customerPhone: selectedAddr?.phone || shippingInfo.phone,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.coverUrl || '',
        sku: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal,
      deliveryFee: shipping,
      discount,
      total,
      paymentMethod,
      shippingAddress: shippingAddress as any,
      ...(shippingInfo.notes ? { notes: shippingInfo.notes } : {}),
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
      deliveryMethod,
      ...(selectedZone && deliveryMethod === 'delivery'
        ? { deliveryZoneId: selectedZone.id, deliveryZoneName: selectedZone.name }
        : {}),
      ...(deliveryMethod === 'pickup' && selectedPickupId
        ? { pickupLocationId: selectedPickupId }
        : {}),
      ...(deliveryMethod === 'pickup' && pickupDate ? { pickupDate } : {}),
    };
  };

  const sendConfirmationEmail = async (orderNumber: string) => {
    try {
      await fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          customerEmail: shippingInfo.email,
          items: items.map((item) => ({
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          subtotal,
          deliveryFee: shipping,
          discount,
          total,
          shippingAddress: {
            fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            addressLine1: shippingInfo.address,
            city: shippingInfo.city,
            phone: shippingInfo.phone,
          },
          paymentMethod,
        }),
      });
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!authenticated || !user) {
      router.push(paths.auth.firebase.signIn);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cart Validation Pre-Check
      for (const item of items) {
        const productRef = doc(FIRESTORE, 'products', item.id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product "${item.name}" is no longer available.`);
        }

        const currentStock = productSnap.data().stock ?? 0;
        if (currentStock < item.quantity) {
          throw new Error(
            `Out of stock! "${item.name}" only has ${currentStock} item(s) available. Please adjust your cart.`
          );
        }
      }

      if (paymentMethod === 'cash_on_delivery') {
        // For cash on delivery, create order directly
        const result = await createOrder(buildOrderData());
        if (result) {
          if (appliedCoupon) {
            await incrementCouponUsage(appliedCoupon.id);
          }
          await sendConfirmationEmail(result.orderNumber);
          checkout.onResetCart();
          router.push(
            `/checkout/success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`
          );
        } else {
          setError(orderError || 'Failed to create order');
        }
      } else {
        // For Pesapal payments — redirect to hosted payment page
        await initiatePesapalPayment();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const initiatePesapalPayment = async () => {
    try {
      // Save pending order to sessionStorage so the callback page can reconstruct it
      const pendingOrderData = {
        ...buildOrderData(),
        paymentMethod: 'pesapal' as const,
        appliedCouponId: appliedCoupon?.id || null,
      };
      sessionStorage.setItem('pp_pending_order', JSON.stringify(pendingOrderData));

      const merchantRef = generateMerchantRef('CP');

      const res = await fetch('/api/payments/pesapal/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          description: `ComponentPulse Order (${items.length} item${items.length !== 1 ? 's' : ''})`,
          orderId: merchantRef,
          customer: {
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to initiate payment. Please try again.');
        return;
      }

      // Full-page redirect to Pesapal hosted payment page
      window.location.href = data.redirect_url;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
    }
  };

  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Iconify
          icon="solar:cart-large-2-bold-duotone"
          width={100}
          sx={{ color: 'text.disabled', mb: 3 }}
        />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Add some products to your cart before checking out.
        </Typography>
        <Button component={RouterLink} href={paths.products} variant="contained" size="large">
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

      {/* Email field - always required */}
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={shippingInfo.email}
        onChange={handleShippingChange}
        required
        sx={{ mb: 3 }}
      />

      {/* Saved Addresses Section */}
      {authenticated && savedAddresses.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Select a delivery address
          </Typography>
          <Stack spacing={2}>
            {savedAddresses.map((address) => (
              <Card
                key={address.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: 2,
                  borderColor:
                    selectedAddressId === address.id && !useNewAddress ? 'primary.main' : 'divider',
                  bgcolor:
                    selectedAddressId === address.id && !useNewAddress
                      ? 'primary.lighter'
                      : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                }}
                onClick={() => {
                  setSelectedAddressId(address.id);
                  setUseNewAddress(false);
                  setError(null);
                }}
              >
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                  <Radio
                    checked={selectedAddressId === address.id && !useNewAddress}
                    sx={{ p: 0, mt: 0.5 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle2">{address.label}</Typography>
                      {address.id === defaultAddressId && (
                        <Chip size="small" label="Default" color="primary" />
                      )}
                    </Stack>
                    <Typography variant="body2">{address.fullName}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {address.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {address.city}, {address.country}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            ))}

            {/* Add New Address Option */}
            <Card
              sx={{
                p: 2,
                cursor: 'pointer',
                border: 2,
                borderColor: useNewAddress ? 'primary.main' : 'divider',
                bgcolor: useNewAddress ? 'primary.lighter' : 'transparent',
                borderStyle: 'dashed',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                },
              }}
              onClick={() => {
                setUseNewAddress(true);
                setSelectedAddressId(null);
                setError(null);
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Radio checked={useNewAddress} sx={{ p: 0 }} />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="mingcute:add-line" width={20} />
                  <Typography variant="subtitle2">Use a different address</Typography>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Box>
      )}

      {/* New Address Form - Show if no saved addresses or user chooses new address */}
      <Collapse in={!authenticated || savedAddresses.length === 0 || useNewAddress}>
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
            />
          </Grid>
        </Grid>
      </Collapse>

      {/* Order Notes - Always visible */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Order Notes (Optional)"
        name="notes"
        value={shippingInfo.notes}
        onChange={handleShippingChange}
        placeholder="Special instructions for delivery..."
        sx={{ mt: 3 }}
      />

      {/* Link to manage addresses */}
      {authenticated && (
        <Box sx={{ mt: 2 }}>
          <Button
            component={RouterLink}
            href={paths.account.addresses}
            size="small"
            startIcon={<Iconify icon="solar:settings-bold" width={18} />}
          >
            Manage saved addresses
          </Button>
        </Box>
      )}
    </Card>
  );

  const renderDeliveryStep = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Delivery Options
      </Typography>

      <Tabs value={deliveryMethod} onChange={(e, v) => setDeliveryMethod(v)} sx={{ mb: 3 }}>
        <Tab
          label="Delivery"
          value="delivery"
          icon={<Iconify icon="solar:delivery-bold" />}
          iconPosition="start"
        />
        <Tab
          label="Store Pick-up"
          value="pickup"
          icon={<Iconify icon="solar:shop-bold" />}
          iconPosition="start"
        />
      </Tabs>

      {deliveryMethod === 'delivery' && (
        <>
          {zonesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : zones.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No delivery zones available at the moment.
            </Typography>
          ) : (
            <RadioGroup
              value={selectedZoneId || ''}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              <Stack spacing={2}>
                {zones.map((zone) => (
                  <Card
                    key={zone.id}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: selectedZoneId === zone.id ? 'primary.main' : 'divider',
                      bgcolor: selectedZoneId === zone.id ? 'primary.lighter' : 'transparent',
                    }}
                    onClick={() => setSelectedZoneId(zone.id)}
                  >
                    <FormControlLabel
                      value={zone.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1">{zone.name}</Typography>
                            <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                              {zone.fee === 0 ? 'FREE' : fCurrency(zone.fee)}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {zone.estimatedDays}
                          </Typography>
                          {zone.areas.length > 0 && (
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                              Covers: {zone.areas.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Card>
                ))}
              </Stack>
            </RadioGroup>
          )}
        </>
      )}

      {deliveryMethod === 'pickup' && (
        <>
          {pickupLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : pickupLocations.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No pick-up locations available.
            </Typography>
          ) : (
            <Stack spacing={3}>
              <RadioGroup
                value={selectedPickupId || ''}
                onChange={(e) => setSelectedPickupId(e.target.value)}
              >
                <Stack spacing={2}>
                  {pickupLocations.map((loc) => (
                    <Card
                      key={loc.id}
                      sx={{
                        p: 2.5,
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedPickupId === loc.id ? 'primary.main' : 'divider',
                        bgcolor: selectedPickupId === loc.id ? 'primary.lighter' : 'transparent',
                      }}
                      onClick={() => setSelectedPickupId(loc.id)}
                    >
                      <FormControlLabel
                        value={loc.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle1">{loc.name}</Typography>
                              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                                FREE
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {loc.address}
                            </Typography>
                            {loc.instructions && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {loc.instructions}
                              </Typography>
                            )}
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Card>
                  ))}
                </Stack>
              </RadioGroup>

              {selectedPickupId && (
                <TextField
                  type="date"
                  label="Preferred Pick-up Date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Stack>
          )}
        </>
      )}
    </Card>
  );

  const renderPaymentStep = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Payment Method
      </Typography>

      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
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

      {paymentMethod === 'pesapal' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          You will be redirected to Pesapal&apos;s secure payment page to complete your payment via
          Card, Mobile Money, or Bank Transfer.
        </Alert>
      )}

      {paymentMethod === 'cash_on_delivery' && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Cash on Delivery is only available within Kampala. An additional UGX 5,000 handling fee
          may apply.
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
              src={
                item.coverUrl ||
                'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=80&q=80'
              }
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
            <Typography variant="body2">{fCurrency(item.price * item.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {!appliedCoupon ? (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Discount code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            />
            <Button
              variant="contained"
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || couponValidating}
            >
              {couponValidating ? 'Checking...' : 'Apply'}
            </Button>
          </Stack>
          {couponError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {couponError}
            </Typography>
          )}
        </Box>
      ) : (
        <Card sx={{ p: 2, bgcolor: 'success.lighter', color: 'success.darker', mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:ticket-sale-bold" />
              <Typography variant="subtitle2">{appliedCoupon.code}</Typography>
            </Stack>
            <IconButton size="small" onClick={handleRemoveCoupon} sx={{ color: 'success.darker' }}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>
        </Card>
      )}

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
          <Typography variant="body2">{shipping === 0 ? 'FREE' : fCurrency(shipping)}</Typography>
        </Stack>

        {discount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount {appliedCoupon && `(${appliedCoupon.code})`}
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

            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {!authenticated && activeStep === steps.length - 1 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please{' '}
                <RouterLink href={paths.auth.firebase.signIn} style={{ fontWeight: 'bold' }}>
                  sign in
                </RouterLink>{' '}
                to complete your order.
              </Alert>
            )}

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || loading || creatingOrder}
                startIcon={<Iconify icon="solar:arrow-left-bold" />}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  loading || creatingOrder || (activeStep === 0 && !checkValidationSilently())
                }
                endIcon={
                  loading || creatingOrder ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    <Iconify icon="solar:card-bold" />
                  ) : (
                    <Iconify icon="solar:arrow-right-bold" />
                  )
                }
              >
                {loading || creatingOrder
                  ? 'Processing...'
                  : activeStep === steps.length - 1
                    ? 'Place Order'
                    : 'Continue'}
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>{renderOrderSummary()}</Grid>
        </Grid>
      </Container>
    </Box>
  );
}
