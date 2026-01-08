'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DealsListView() {
  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Deals</Typography>
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
          Create Deal
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No deals configured. Create deals to offer special promotions to customers.
        </Typography>
      </Card>
    </DashboardContent>
  );
}
