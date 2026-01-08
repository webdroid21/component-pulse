'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DeliveryZonesView() {
  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Delivery Zones</Typography>
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
          Add Zone
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No delivery zones configured. Add zones to define delivery areas and fees.
        </Typography>
      </Card>
    </DashboardContent>
  );
}
