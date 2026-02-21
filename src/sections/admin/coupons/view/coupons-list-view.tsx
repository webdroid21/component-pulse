'use client';

import type { Coupon } from 'src/types/coupon';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useCoupons, useCouponMutations } from 'src/hooks/firebase';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type FormValues = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxUses: number;
  isActive: boolean;
  expiresAt: string; // date input string
  description: string;
};

const DEFAULT_VALUES: FormValues = {
  code: '',
  type: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxUses: 0,
  isActive: true,
  expiresAt: '',
  description: '',
};

// ----------------------------------------------------------------------

export function CouponsListView() {
  const { coupons, loading } = useCoupons();
  const { createCoupon, updateCoupon, deleteCoupon, loading: mutating } = useCouponMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });
  const couponType = watch('type');

  const openCreate = () => {
    setEditingCoupon(null);
    reset(DEFAULT_VALUES);
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxUses: coupon.maxUses || 0,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt
        ? coupon.expiresAt.toDate().toISOString().split('T')[0]
        : '',
      description: coupon.description || '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    const data = {
      code: values.code,
      type: values.type,
      value: Number(values.value),
      isActive: values.isActive,
      minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : undefined,
      maxUses: values.maxUses ? Number(values.maxUses) : undefined,
      expiresAt: values.expiresAt ? new Date(values.expiresAt) : null,
      description: values.description || undefined,
    };

    const success = editingCoupon
      ? await updateCoupon(editingCoupon.id, data)
      : await createCoupon(data);

    if (success) {
      setDialogOpen(false);
      reset(DEFAULT_VALUES);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCoupon(deleteId);
    setDeleteId(null);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    await updateCoupon(coupon.id, { isActive: !coupon.isActive });
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Box>
          <Typography variant="h4">Coupons</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create discount codes for your customers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openCreate}
        >
          Create Coupon
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Min Order</TableCell>
                <TableCell>Uses</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No coupons yet. Create one to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && coupon.expiresAt.toDate() < new Date();
                  return (
                    <TableRow key={coupon.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={coupon.code}
                            size="small"
                            sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}
                          />
                        </Stack>
                        {coupon.description && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {coupon.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                          color={coupon.type === 'percentage' ? 'info' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% off`
                            : `${fCurrency(coupon.value)} off`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {coupon.minOrderAmount
                          ? fCurrency(coupon.minOrderAmount)
                          : <Typography variant="caption" sx={{ color: 'text.disabled' }}>None</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {coupon.usedCount}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt ? (
                          <Typography
                            variant="caption"
                            sx={{ color: isExpired ? 'error.main' : 'text.secondary' }}
                          >
                            {fDateTime(coupon.expiresAt.toDate())}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>Never</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.isActive && !isExpired}
                          disabled={!!isExpired || mutating}
                          onChange={() => handleToggleActive(coupon)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end">
                          <IconButton size="small" onClick={() => openEdit(coupon)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteId(coupon.id)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Controller
                name="code"
                control={control}
                rules={{ required: 'Code is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Coupon Code"
                    placeholder="e.g. SAVE20"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || 'Customers will enter this at checkout'}
                    inputProps={{ style: { textTransform: 'uppercase', letterSpacing: 2 } }}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                )}
              />

              <Stack direction="row" spacing={2}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Discount Type</InputLabel>
                      <Select {...field} label="Discount Type">
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="fixed">Fixed Amount (UGX)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="value"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={couponType === 'percentage' ? 'Discount %' : 'Discount Amount (UGX)'}
                      type="number"
                      fullWidth
                      required
                      inputProps={{ min: 1, max: couponType === 'percentage' ? 100 : undefined }}
                    />
                  )}
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Controller
                  name="minOrderAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Min Order Amount (UGX)"
                      type="number"
                      fullWidth
                      helperText="0 = no minimum"
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                <Controller
                  name="maxUses"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Max Uses"
                      type="number"
                      fullWidth
                      helperText="0 = unlimited"
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
              </Stack>

              <Controller
                name="expiresAt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiry Date (Optional)"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    placeholder="Internal note about this coupon"
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label="Active"
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={mutating}>
              {mutating ? 'Saving...' : editingCoupon ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Coupon"
        content="Are you sure you want to delete this coupon? This cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
