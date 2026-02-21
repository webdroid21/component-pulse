'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {
  useOrders,
  useAdmins,
  useProducts,
  useCustomers,
  useCategories,
  useGetTickets,
  useGetAllReviews,
  useTrainingModules,
} from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardMetricCard } from '../dashboard-metric-card';
import { DashboardSalesOverview } from '../dashboard-sales-overview';
import { DashboardLatestProducts } from '../dashboard-latest-products';

// ----------------------------------------------------------------------

export function AdminDashboardView() {
  const { user } = useAuthContext();
  const theme = useTheme();

  // Fetch all real-time data
  const { orders } = useOrders();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { categories } = useCategories();
  const { reviews } = useGetAllReviews();
  const { tickets } = useGetTickets();
  const { modules } = useTrainingModules();
  const { admins } = useAdmins();

  // 1. Calculate Revenue & Orders
  const { totalRevenue, completedRevenue, pendingRevenue, cancelledRevenue } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    orders.forEach((order) => {
      total += order.total;
      if (['delivered', 'shipped'].includes(order.status)) {
        completed += order.total;
      } else if (order.status === 'cancelled') {
        cancelled += order.total;
      } else {
        pending += order.total;
      }
    });

    return { totalRevenue: total, completedRevenue: completed, pendingRevenue: pending, cancelledRevenue: cancelled };
  }, [orders]);

  // 2. Metrics for the 8 cards
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const totalCategories = categories.length;
  const pendingReviews = reviews.filter((r) => !r.isApproved).length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const activeModules = modules.filter((m) => m.status === 'active').length;
  const totalAdmins = admins.length;

  // 3. Latest Products
  const latestProducts = useMemo(
    () =>
      products.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.name,
        coverUrl: p.images[0]?.url || '',
        price: p.price,
        priceSale: p.salePrice || null,
      })),
    [products]
  );

  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">
          Welcome back, {user?.displayName || 'Admin'} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Here&apos;s what&apos;s happening with your store today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Row 1: Finances & Volume */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Total Revenue"
            total={totalRevenue}
            percent={2.6}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Total Orders"
            total={orders.length}
            percent={0.2}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Total Products"
            total={totalProducts}
            percent={0}
            chart={{
              colors: [theme.palette.primary.light, theme.palette.primary.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Total Customers"
            total={totalCustomers}
            percent={5.0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        {/* Row 2: Moderation & Misc */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Pending Reviews"
            total={pendingReviews}
            percent={0}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [5, 2, 0, 1, 3, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Open Tickets"
            total={openTickets}
            percent={0}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [1, 1, 2, 0, 1, 0, 1, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Active Modules"
            total={activeModules}
            percent={0}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [10, 10, 12, 12, 14, 15, 15, 15],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardMetricCard
            title="Staff Members"
            total={totalAdmins}
            percent={0}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [1, 2, 2, 2, 2, 3, 3, 3],
            }}
          />
        </Grid>

        {/* Row 3: Visual Overviews */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <DashboardSalesOverview
            title="Sales Overview"
            data={[
              {
                label: 'Completed',
                value: totalRevenue ? (completedRevenue / totalRevenue) * 100 : 0,
                totalAmount: completedRevenue,
              },
              {
                label: 'Pending',
                value: totalRevenue ? (pendingRevenue / totalRevenue) * 100 : 0,
                totalAmount: pendingRevenue,
              },
              {
                label: 'Cancelled',
                value: totalRevenue ? (cancelledRevenue / totalRevenue) * 100 : 0,
                totalAmount: cancelledRevenue,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardLatestProducts title="Latest Products" list={latestProducts} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
