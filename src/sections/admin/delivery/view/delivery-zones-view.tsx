'use client';

import type { DeliveryZone } from 'src/types/delivery-zone';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDeliveryZones, useDeliveryZoneMutations } from 'src/hooks/firebase';

// ----------------------------------------------------------------------

type FormValues = {
  name: string;
  description: string;
  areasText: string;  // comma-separated areas
  fee: number;
  estimatedDays: string;
  isActive: boolean;
};

const DEFAULT_VALUES: FormValues = {
  name: '',
  description: '',
  areasText: '',
  fee: 0,
  estimatedDays: '2-3 business days',
  isActive: true,
};

// ----------------------------------------------------------------------

export function DeliveryZonesView() {
  const { zones, loading } = useDeliveryZones();
  const { createZone, updateZone, deleteZone, loading: mutating } = useDeliveryZoneMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });

  const openCreate = () => {
    setEditingZone(null);
    reset(DEFAULT_VALUES);
    setDialogOpen(true);
  };

  const openEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    reset({
      name: zone.name,
      description: zone.description || '',
      areasText: zone.areas.join(', '),
      fee: zone.fee,
      estimatedDays: zone.estimatedDays,
      isActive: zone.isActive,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    const areas = values.areasText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const data = {
      name: values.name,
      description: values.description || undefined,
      areas,
      fee: Number(values.fee),
      estimatedDays: values.estimatedDays,
      isActive: values.isActive,
    };

    const success = editingZone
      ? await updateZone(editingZone.id, data)
      : await createZone(data);

    if (success) {
      setDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteZone(deleteId);
    setDeleteId(null);
  };

  const handleToggleActive = async (zone: DeliveryZone) => {
    await updateZone(zone.id, { isActive: !zone.isActive });
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Box>
          <Typography variant="h4">Delivery Zones</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Define areas and fees — customers choose their zone at checkout
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openCreate}
        >
          Add Zone
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : zones.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Iconify icon="solar:delivery-bold-duotone" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>No delivery zones yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Add zones to let customers select their delivery area at checkout.
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={openCreate}>
            Add First Zone
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {zones.map((zone) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={zone.id}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  border: 1,
                  borderColor: zone.isActive ? 'primary.light' : 'divider',
                  opacity: zone.isActive ? 1 : 0.65,
                  transition: 'all 0.2s',
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:map-point-bold" width={20} sx={{ color: 'primary.main' }} />
                      <Typography variant="h6">{zone.name}</Typography>
                    </Stack>
                    {zone.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {zone.description}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row">
                    <IconButton size="small" onClick={() => openEdit(zone)}>
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteId(zone.id)}>
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Delivery Fee
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {zone.fee === 0 ? 'FREE' : fCurrency(zone.fee)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Estimated
                    </Typography>
                    <Typography variant="body2">{zone.estimatedDays}</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Areas */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                    Covers
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {zone.areas.map((area) => (
                      <Chip key={area} label={area} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={zone.isActive}
                      onChange={() => handleToggleActive(zone)}
                      disabled={mutating}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">{zone.isActive ? 'Active' : 'Inactive'}</Typography>
                  }
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingZone ? 'Edit Delivery Zone' : 'Add Delivery Zone'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Zone name is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Zone Name"
                    placeholder="e.g. Kampala Central"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
                    placeholder="Brief description of this zone"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="areasText"
                control={control}
                rules={{ required: 'At least one area is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Areas Covered"
                    placeholder="Kampala CBD, Kololo, Nakasero"
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || 'Separate areas with commas'}
                  />
                )}
              />

              <Stack direction="row" spacing={2}>
                <Controller
                  name="fee"
                  control={control}
                  rules={{ required: true, min: 0 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Delivery Fee (UGX)"
                      type="number"
                      fullWidth
                      required
                      helperText="Enter 0 for free delivery"
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                <Controller
                  name="estimatedDays"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Estimated Delivery"
                      placeholder="1-2 business days"
                      fullWidth
                      required
                    />
                  )}
                />
              </Stack>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label="Active (visible to customers at checkout)"
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={mutating}>
              {mutating ? 'Saving...' : editingZone ? 'Save Changes' : 'Add Zone'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Delivery Zone"
        content="Are you sure you want to delete this zone? Existing orders won't be affected."
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
