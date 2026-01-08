'use client';

import type { UserAddress } from 'src/types/user';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useUserProfile, useUserProfileMutations } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

const AddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof AddressSchema>;

// ----------------------------------------------------------------------

export function AccountAddressesView() {
  const { profile, loading, refetch } = useUserProfile();
  const { addAddress, updateAddress, deleteAddress, setDefaultAddress, loading: mutating } = useUserProfileMutations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<UserAddress | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAddress | null>(null);

  const addresses = profile?.addresses || [];

  const defaultValues: AddressFormValues = {
    label: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Uganda',
    deliveryInstructions: '',
    isDefault: false,
  };

  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const handleOpenCreate = () => {
    reset(defaultValues);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (address: UserAddress) => {
    reset({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      district: address.district || '',
      postalCode: address.postalCode || '',
      country: address.country,
      deliveryInstructions: address.deliveryInstructions || '',
      isDefault: address.isDefault || false,
    });
    setEditAddress(address);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditAddress(null);
    reset(defaultValues);
  };

  const onSubmit = handleSubmit(async (data) => {
    let success = false;

    if (editAddress) {
      success = await updateAddress(editAddress.id, data);
    } else {
      success = await addAddress(data);
    }

    if (success) {
      handleClose();
      refetch();
    }
  });

  const handleDelete = useCallback(async () => {
    if (deleteTarget) {
      const success = await deleteAddress(deleteTarget);
      if (success) {
        refetch();
      }
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteAddress, refetch]);

  const handleSetDefault = useCallback(async (addressId: string) => {
    const success = await setDefaultAddress(addressId);
    if (success) {
      refetch();
    }
  }, [setDefaultAddress, refetch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">My Addresses</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreate}
          >
            Add Address
          </Button>
        </Box>

        {addresses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You haven&apos;t saved any addresses yet.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Add an address for faster checkout!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid key={address.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">{address.label}</Typography>
                    {profile?.defaultAddressId === address.id && (
                      <Chip size="small" label="Default" color="primary" />
                    )}
                  </Box>

                  <Typography variant="body2">{address.fullName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {address.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {address.city}, {address.country}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {profile?.defaultAddressId !== address.id && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={mutating}
                      >
                        Set Default
                      </Button>
                    )}
                    <IconButton size="small" onClick={() => handleOpenEdit(address)}>
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(address)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>

      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>{editAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Field.Text name="label" label="Label (e.g., Home, Office)" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="fullName" label="Full Name" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="phone" label="Phone" />
                </Grid>
              </Grid>
              <Field.Text name="addressLine1" label="Address Line 1" />
              <Field.Text name="addressLine2" label="Address Line 2 (Optional)" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="city" label="City" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="district" label="District (Optional)" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="postalCode" label="Postal Code (Optional)" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text name="country" label="Country" />
                </Grid>
              </Grid>
              <Field.Text
                name="deliveryInstructions"
                label="Delivery Instructions (Optional)"
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {editAddress ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Address"
        content="Are you sure you want to delete this address?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
