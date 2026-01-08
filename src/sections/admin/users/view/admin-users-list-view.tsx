'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminUsersListView() {
  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Admin Users</Typography>
        <Button
          component={RouterLink}
          href={paths.admin.users.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add Admin
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Admin users will be listed here. Only Super Admins can manage admin users.
        </Typography>
      </Card>
    </DashboardContent>
  );
}
