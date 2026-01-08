'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const STATS = [
  { title: 'Total Orders', value: '0', color: 'primary.main' },
  { title: 'Pending Orders', value: '0', color: 'warning.main' },
  { title: 'Total Products', value: '0', color: 'info.main' },
  { title: 'Total Customers', value: '0', color: 'success.main' },
];

export function AdminDashboardView() {
  const { user } = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">
          Welcome back, {user?.displayName || 'Admin'} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Here&apos;s what&apos;s happening with your store today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {STATS.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ color: stat.color, mt: 1 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Orders
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No orders yet. Orders will appear here once customers start purchasing.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">• Add new product</Typography>
                <Typography variant="body2">• View pending orders</Typography>
                <Typography variant="body2">• Manage categories</Typography>
                <Typography variant="body2">• Update delivery zones</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
