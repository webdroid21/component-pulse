'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useSettings, useSettingsMutations } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type TabValue = 'general' | 'business' | 'shipping' | 'notifications' | 'social';

export function SettingsView() {
  const { settings, loading, refetch } = useSettings();
  const { updateSettings, loading: saving } = useSettingsMutations();

  const [currentTab, setCurrentTab] = useState<TabValue>('general');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: settings,
  });

  const watchTaxIncluded = watch('taxIncluded');
  const watchLowStockNotification = watch('lowStockNotification');

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const result = await updateSettings(data);
    if (result) {
      setSuccess(true);
      refetch();
    }
  });

  const TABS = [
    { value: 'general', label: 'General' },
    { value: 'business', label: 'Business' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'social', label: 'Social Links' },
  ];

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Settings</Typography>
      </Box>

      <form onSubmit={onSubmit}>
        <Card>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{ px: 3, pt: 2 }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Divider />

          {/* General Settings */}
          {currentTab === 'general' && (
            <CardContent>
              <Stack spacing={3}>
                <CardHeader title="Store Information" sx={{ p: 0 }} />
                <TextField
                  label="Store Name"
                  {...register('storeName')}
                  fullWidth
                />
                <TextField
                  label="Store Email"
                  type="email"
                  {...register('storeEmail')}
                  fullWidth
                />
                <TextField
                  label="Store Phone"
                  {...register('storePhone')}
                  fullWidth
                />
                <TextField
                  label="Store Address"
                  {...register('storeAddress')}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
            </CardContent>
          )}

          {/* Business Settings */}
          {currentTab === 'business' && (
            <CardContent>
              <Stack spacing={3}>
                <CardHeader title="Currency & Tax" sx={{ p: 0 }} />
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    label="Currency Code"
                    {...register('currency')}
                    placeholder="UGX"
                  />
                  <TextField
                    label="Currency Symbol"
                    {...register('currencySymbol')}
                    placeholder="UGX"
                  />
                </Box>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    label="Tax Rate"
                    type="number"
                    {...register('taxRate', { valueAsNumber: true })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={watchTaxIncluded}
                        onChange={(e) => setValue('taxIncluded', e.target.checked)}
                      />
                    }
                    label="Prices include tax"
                  />
                </Box>

                <Divider />

                <CardHeader title="Order Settings" sx={{ p: 0 }} />
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    label="Minimum Order Amount"
                    type="number"
                    {...register('minOrderAmount', { valueAsNumber: true })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Maximum Order Amount"
                    type="number"
                    {...register('maxOrderAmount', { valueAsNumber: true })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    }}
                  />
                </Box>
                <TextField
                  label="Order Number Prefix"
                  {...register('orderPrefix')}
                  placeholder="CP"
                  helperText="Orders will be numbered like CP-0001, CP-0002, etc."
                  sx={{ maxWidth: 200 }}
                />
              </Stack>
            </CardContent>
          )}

          {/* Shipping Settings */}
          {currentTab === 'shipping' && (
            <CardContent>
              <Stack spacing={3}>
                <CardHeader title="Shipping Configuration" sx={{ p: 0 }} />
                <TextField
                  label="Default Shipping Fee"
                  type="number"
                  {...register('defaultShippingFee', { valueAsNumber: true })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                  fullWidth
                />
                <TextField
                  label="Free Shipping Threshold"
                  type="number"
                  {...register('freeShippingThreshold', { valueAsNumber: true })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                  helperText="Orders above this amount get free shipping. Set to 0 to disable."
                  fullWidth
                />
              </Stack>
            </CardContent>
          )}

          {/* Notification Settings */}
          {currentTab === 'notifications' && (
            <CardContent>
              <Stack spacing={3}>
                <CardHeader title="Email Notifications" sx={{ p: 0 }} />
                <TextField
                  label="Order Notification Email"
                  type="email"
                  {...register('orderNotificationEmail')}
                  helperText="Email address to receive order notifications"
                  fullWidth
                />

                <Divider />

                <CardHeader title="Stock Alerts" sx={{ p: 0 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={watchLowStockNotification}
                      onChange={(e) => setValue('lowStockNotification', e.target.checked)}
                    />
                  }
                  label="Enable low stock notifications"
                />
                {watchLowStockNotification && (
                  <TextField
                    label="Low Stock Threshold"
                    type="number"
                    {...register('lowStockThreshold', { valueAsNumber: true })}
                    helperText="Alert when product stock falls below this number"
                    sx={{ maxWidth: 200 }}
                  />
                )}
              </Stack>
            </CardContent>
          )}

          {/* Social Links */}
          {currentTab === 'social' && (
            <CardContent>
              <Stack spacing={3}>
                <CardHeader title="Social Media Links" sx={{ p: 0 }} />
                <TextField
                  label="Facebook"
                  {...register('socialLinks.facebook')}
                  placeholder="https://facebook.com/yourpage"
                  fullWidth
                />
                <TextField
                  label="Instagram"
                  {...register('socialLinks.instagram')}
                  placeholder="https://instagram.com/yourpage"
                  fullWidth
                />
                <TextField
                  label="Twitter / X"
                  {...register('socialLinks.twitter')}
                  placeholder="https://twitter.com/yourpage"
                  fullWidth
                />
                <TextField
                  label="WhatsApp"
                  {...register('socialLinks.whatsapp')}
                  placeholder="+256700000000"
                  helperText="Phone number for WhatsApp contact"
                  fullWidth
                />
                <TextField
                  label="TikTok"
                  {...register('socialLinks.tiktok')}
                  placeholder="https://tiktok.com/@yourpage"
                  fullWidth
                />
              </Stack>
            </CardContent>
          )}

          <Divider />

          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={saving}
              startIcon={saving && <CircularProgress size={20} color="inherit" />}
            >
              Save Settings
            </Button>
          </Box>
        </Card>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
