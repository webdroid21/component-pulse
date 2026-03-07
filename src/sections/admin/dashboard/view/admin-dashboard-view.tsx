'use client';

import type { DateRange } from '../dashboard-filter-bar';
import type { ReportRow, ReportColumn } from '../dashboard-report-dialog';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {
  useOrders,
  useProducts,
  useCustomers,
  useCategories,
  useGetTickets,
  useGetAllReviews,
  useTrainingModules,
} from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardFilterBar } from '../dashboard-filter-bar';
import { DashboardMetricCard } from '../dashboard-metric-card';
import { DashboardDonutChart } from '../dashboard-donut-chart';
import { DashboardStockTable } from '../dashboard-stock-table';
import { DashboardReportDialog } from '../dashboard-report-dialog';
import { DashboardRevenueChart } from '../dashboard-revenue-chart';
import { DashboardSalesOverview } from '../dashboard-sales-overview';
import { DashboardLatestProducts } from '../dashboard-latest-products';

// ----------------------------------------------------------------------

type ReportConfig = {
  title: string;
  description: string;
  rows: ReportRow[];
  columns: ReportColumn[];
};

function formatTs(ts: any): string {
  if (!ts) return '—';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function inRange(ts: any, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  const date = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
  if (!date) return true;
  if (range.from && date < range.from) return false;
  if (range.to && date > range.to) return false;
  return true;
}

// ----------------------------------------------------------------------

export function AdminDashboardView() {
  const { user } = useAuthContext();
  const theme = useTheme();

  // ── Date filter state ──────────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
  });
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // ── Report dialog state ─────────────────────────────────────────────
  const [reportOpen, setReportOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: '',
    description: '',
    rows: [],
    columns: [],
  });

  const openReport = useCallback((config: ReportConfig) => {
    setReportConfig(config);
    setReportOpen(true);
  }, []);

  // ── Firebase data ───────────────────────────────────────────────────
  const { orders } = useOrders();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { categories } = useCategories();
  const { reviews } = useGetAllReviews();
  const { tickets } = useGetTickets();
  const { modules } = useTrainingModules();
  // const { admins } = useAdmins();

  // ── Filtered by date range ──────────────────────────────────────────
  const filteredOrders = useMemo(
    () => orders.filter((o) => inRange(o.createdAt, dateRange)),
    [orders, dateRange]
  );

  const filteredCustomers = useMemo(
    () => customers.filter((c) => inRange(c.createdAt, dateRange)),
    [customers, dateRange]
  );

  // ── Revenue aggregates ──────────────────────────────────────────────
  const { totalRevenue, completedRevenue, pendingRevenue, cancelledRevenue } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    filteredOrders.forEach((order) => {
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
  }, [filteredOrders]);

  // ── Aggregated metrics ──────────────────────────────────────────────
  const totalOrders = filteredOrders.length;
  const totalProducts = products.length;
  const totalCustomers = filteredCustomers.length;
  const totalCategories = categories.length;

  const pendingReviews = reviews.filter((r) => !r.isApproved).length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const activeModules = modules.filter((m) => m.status === 'active').length;

  // New metrics
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const inventoryValuation = useMemo(
    () => products.reduce((acc, p) => acc + p.price * (p.stock ?? 0), 0),
    [products]
  );

  const lowStockProducts = useMemo(
    () =>
      products.filter((p) => {
        const threshold = p.lowStockThreshold ?? 5;
        return (p.stock ?? 0) <= threshold;
      }),
    [products]
  );

  const couponsUsed = useMemo(
    () => filteredOrders.filter((o) => !!o.couponCode).length,
    [filteredOrders]
  );

  const conversionRate = useMemo(() => {
    const allCustomers = customers.length;
    return allCustomers > 0 ? (totalOrders / allCustomers) * 100 : 0;
  }, [customers.length, totalOrders]);

  // Year-filtered revenue (for month-by-month chart labels)
  const revenueByMonth = useMemo(() => {
    const months = Array(12).fill(0);
    const tsToDate = (ts: any): Date => (ts?.toDate ? ts.toDate() : new Date(ts));
    orders
      .filter((o) => tsToDate(o.createdAt).getFullYear() === selectedYear)
      .forEach((o) => {
        months[tsToDate(o.createdAt).getMonth()] += o.total;
      });
    return months.map((v) => Math.round(v));
  }, [orders, selectedYear]);

  // ── Latest products ─────────────────────────────────────────────────
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

  // ── Stock breakdown ──────────────────────────────────────────────────
  const outOfStockProducts = useMemo(
    () => products.filter((p) => (p.stock ?? 0) <= 0),
    [products]
  );
  const criticalStockProducts = useMemo(
    () =>
      products.filter((p) => {
        const s = p.stock ?? 0;
        const t = p.lowStockThreshold ?? 5;
        return s > 0 && s <= Math.ceil(t * 0.5);
      }),
    [products]
  );
  const lowStockOnly = useMemo(
    () =>
      products.filter((p) => {
        const s = p.stock ?? 0;
        const t = p.lowStockThreshold ?? 5;
        return s > Math.ceil(t * 0.5) && s <= t;
      }),
    [products]
  );

  // ── Chart data ───────────────────────────────────────────────────────
  const tsToDate = (ts: any): Date => (ts?.toDate ? ts.toDate() : new Date(ts));

  const yearlySalesData = useMemo(() => {
    const years = Array.from(
      new Set(orders.map((o) => String(tsToDate(o.createdAt).getFullYear())))
    ).sort((a, b) => Number(b) - Number(a)).slice(0, 3);

    if (years.length === 0) years.push(String(selectedYear));

    return years.map((yr) => {
      const rev = Array(12).fill(0);
      const ords = Array(12).fill(0);
      orders
        .filter((o) => String(tsToDate(o.createdAt).getFullYear()) === yr)
        .forEach((o) => {
          const m = tsToDate(o.createdAt).getMonth();
          rev[m] += o.total;
          ords[m] += 1;
        });
      return { year: yr, revenue: rev.map(Math.round), orders: ords };
    });
  }, [orders, selectedYear]);

  const orderStatusPie = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      map[o.status] = (map[o.status] ?? 0) + 1;
    });
    return Object.entries(map).map(([label, value]) => ({
      label: label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    }));
  }, [filteredOrders]);

  const categoryRevenuePie = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      o.items?.forEach((item: any) => {
        const cat = item.categoryName ?? item.categoryId ?? 'Unknown';
        map[cat] = (map[cat] ?? 0) + item.totalPrice;
      });
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return entries.map(([label, value]) => ({ label, value: Math.round(value) }));
  }, [filteredOrders]);

  // ── Sparkline placeholders ──────────────────────────────────────────
  const MONTHS_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  // ── Report handlers ─────────────────────────────────────────────────
  const handleRevenueReport = () => {
    openReport({
      title: 'Revenue Report',
      description: `All orders in the selected date range. Total: ${fCurrency(totalRevenue)}`,
      rows: filteredOrders.map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customerName,
        status: o.status,
        payment: o.paymentStatus,
        total: o.total,
        date: o.createdAt,
      })),
      columns: [
        { key: 'orderNumber', label: 'Order #' },
        { key: 'customer', label: 'Customer' },
        { key: 'status', label: 'Status' },
        { key: 'payment', label: 'Payment' },
        { key: 'total', label: 'Total', format: (v) => fCurrency(v) },
        { key: 'date', label: 'Date', format: formatTs },
      ],
    });
  };

  const handleOrdersReport = () => {
    openReport({
      title: 'Orders Report',
      description: `${totalOrders} orders in the selected date range`,
      rows: filteredOrders.map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customerName,
        email: o.customerEmail,
        items: o.items?.length ?? 0,
        status: o.status,
        total: o.total,
        date: o.createdAt,
      })),
      columns: [
        { key: 'orderNumber', label: 'Order #' },
        { key: 'customer', label: 'Customer' },
        { key: 'email', label: 'Email' },
        { key: 'items', label: 'Items' },
        { key: 'status', label: 'Status' },
        { key: 'total', label: 'Total', format: (v) => fCurrency(v) },
        { key: 'date', label: 'Date', format: formatTs },
      ],
    });
  };

  const handleProductsReport = () => {
    openReport({
      title: 'Products Report',
      description: `All ${totalProducts} products in inventory`,
      rows: products.map((p) => ({
        name: p.name,
        sku: p.sku,
        category: p.categoryName ?? p.categoryId,
        price: p.price,
        stock: p.stock ?? 0,
        status: p.isActive ? 'Active' : 'Inactive',
        valuation: p.price * (p.stock ?? 0),
      })),
      columns: [
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', format: (v) => fCurrency(v) },
        { key: 'stock', label: 'Stock' },
        { key: 'status', label: 'Status' },
        { key: 'valuation', label: 'Valuation', format: (v) => fCurrency(v) },
      ],
    });
  };

  const handleCustomersReport = () => {
    openReport({
      title: 'Customers Report',
      description: `${totalCustomers} new customers in the selected date range`,
      rows: filteredCustomers.map((c) => ({
        name: c.displayName || `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone ?? '—',
        status: c.isActive ? 'Active' : 'Inactive',
        newsletter: c.newsletter ? 'Yes' : 'No',
        joined: c.createdAt,
      })),
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' },
        { key: 'newsletter', label: 'Newsletter' },
        { key: 'joined', label: 'Joined', format: formatTs },
      ],
    });
  };

  const handleInventoryReport = () => {
    openReport({
      title: 'Inventory Valuation Report',
      description: `Total inventory value: ${fCurrency(inventoryValuation)}`,
      rows: products
        .map((p) => ({
          name: p.name,
          sku: p.sku,
          price: p.price,
          stock: p.stock ?? 0,
          valuation: p.price * (p.stock ?? 0),
        }))
        .sort((a, b) => b.valuation - a.valuation),
      columns: [
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'price', label: 'Unit Price', format: (v) => fCurrency(v) },
        { key: 'stock', label: 'Stock Qty' },
        { key: 'valuation', label: 'Total Value', format: (v) => fCurrency(v) },
      ],
    });
  };

  const handleLowStockReport = () => {
    openReport({
      title: 'Low Stock Products',
      description: `${lowStockProducts.length} products at or below their minimum stock threshold`,
      rows: lowStockProducts.map((p) => ({
        name: p.name,
        sku: p.sku,
        stock: p.stock ?? 0,
        threshold: p.lowStockThreshold ?? 5,
        price: p.price,
      })),
      columns: [
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'stock', label: 'Current Stock' },
        { key: 'threshold', label: 'Min Threshold' },
        { key: 'price', label: 'Price', format: (v) => fCurrency(v) },
      ],
    });
  };

  const handleReviewsReport = () => {
    openReport({
      title: 'Pending Reviews',
      description: `${pendingReviews} reviews awaiting moderation`,
      rows: reviews
        .filter((r) => !r.isApproved)
        .map((r) => ({
          product: r.productId,
          name: r.name,
          email: r.email,
          rating: r.rating,
          message: r.message,
          date: r.createdAt,
        })),
      columns: [
        { key: 'name', label: 'Reviewer' },
        { key: 'email', label: 'Email' },
        { key: 'rating', label: 'Rating' },
        { key: 'message', label: 'Comment' },
        { key: 'date', label: 'Date', format: formatTs },
      ],
    });
  };

  const handleTicketsReport = () => {
    openReport({
      title: 'Open Contact Support',
      description: `${openTickets} tickets currently open`,
      rows: tickets
        .filter((t) => t.status === 'open')
        .map((t) => ({
          number: t.ticketNumber,
          subject: t.subject,
          contact: t.contactName,
          email: t.contactEmail,
          priority: t.priority,
          date: t.createdAt,
        })),
      columns: [
        { key: 'number', label: 'Ticket #' },
        { key: 'subject', label: 'Subject' },
        { key: 'contact', label: 'Contact' },
        { key: 'email', label: 'Email' },
        { key: 'priority', label: 'Priority' },
        { key: 'date', label: 'Created', format: formatTs },
      ],
    });
  };

  const handleCouponsReport = () => {
    openReport({
      title: 'Coupon Usage Report',
      description: `${couponsUsed} orders used a coupon in the selected period`,
      rows: filteredOrders
        .filter((o) => !!o.couponCode)
        .map((o) => ({
          coupon: o.couponCode,
          orderNumber: o.orderNumber,
          customer: o.customerName,
          total: o.total,
          date: o.createdAt,
        })),
      columns: [
        { key: 'coupon', label: 'Coupon Code' },
        { key: 'orderNumber', label: 'Order #' },
        { key: 'customer', label: 'Customer' },
        { key: 'total', label: 'Order Total', format: (v) => fCurrency(v) },
        { key: 'date', label: 'Date', format: formatTs },
      ],
    });
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Welcome back, {user?.displayName || 'Admin'} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Here&apos;s what&apos;s happening with your store. Click any card to view a detailed report.
        </Typography>
      </Box>

      {/* Date Filter Bar */}
      <DashboardFilterBar
        range={dateRange}
        selectedYear={selectedYear}
        onRangeChange={setDateRange}
        onYearChange={setSelectedYear}
      />

      <Grid container spacing={3}>
        {/* ── Row 1: Financial Metrics ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Total Revenue"
            total={totalRevenue}
            percent={2.6}
            onClick={handleRevenueReport}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              categories: MONTHS_LABELS,
              series: revenueByMonth,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Total Orders"
            total={totalOrders}
            percent={0.2}
            onClick={handleOrdersReport}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: MONTHS_LABELS,
              series: revenueByMonth.map((_, i) => {
                const tsToDate2 = (ts: any): Date => (ts?.toDate ? ts.toDate() : new Date(ts));
                return orders.filter((o) => {
                  const d = tsToDate2(o.createdAt);
                  return d.getFullYear() === selectedYear && d.getMonth() === i;
                }).length;
              }),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Avg Order Value"
            total={Math.round(avgOrderValue)}
            percent={0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 55, 68, 62, 74, 80, 71, 85],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Total Customers"
            total={customers.length}
            percent={5.0}
            onClick={handleCustomersReport}
            chart={{
              colors: [theme.palette.primary.light, theme.palette.primary.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        {/* ── Row 2: Inventory & Catalogue ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Inventory Valuation"
            total={Math.round(inventoryValuation)}
            percent={0}
            onClick={handleInventoryReport}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [60, 65, 72, 75, 80, 82, 88, 90],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Total Products"
            total={totalProducts}
            percent={0}
            onClick={handleProductsReport}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Low Stock Items"
            total={lowStockProducts.length}
            percent={0}
            onClick={handleLowStockReport}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [2, 1, 3, 2, 4, 3, 2, lowStockProducts.length],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Conversion Rate"
            total={Math.round(conversionRate * 10) / 10}
            percent={0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [5, 7, 6, 8, 10, 9, 11, Math.round(conversionRate)],
            }}
          />
        </Grid>

        {/* ── Row 3: Operations ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Pending Reviews"
            total={pendingReviews}
            percent={0}
            onClick={handleReviewsReport}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [5, 2, 0, 1, 3, 0, 0, pendingReviews],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Open Tickets"
            total={openTickets}
            percent={0}
            onClick={handleTicketsReport}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [1, 1, 2, 0, 1, 0, 1, openTickets],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Coupons Used"
            total={couponsUsed}
            percent={0}
            onClick={handleCouponsReport}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 1, 2, 1, 3, 2, 1, couponsUsed],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardMetricCard
            title="Active Modules"
            total={activeModules}
            percent={0}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [10, 10, 12, 12, 14, 15, 15, activeModules],
            }}
          />
        </Grid>

        {/* ── Visual Overviews ── */}

        {/* ── Visual Overviews ── */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <DashboardSalesOverview
            title={`Sales Overview — ${selectedYear}`}
            subheader="Order revenue breakdown by status"
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

        {/* ── Stock Alert Cards ── */}
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DashboardMetricCard
            title="Out of Stock"
            total={outOfStockProducts.length}
            percent={0}
            onClick={() =>
              openReport({
                title: 'Out of Stock Products',
                description: `${outOfStockProducts.length} products with zero stock`,
                rows: outOfStockProducts.map((p) => ({
                  name: p.name,
                  sku: p.sku,
                  price: p.price,
                  lastStock: 0,
                })),
                columns: [
                  { key: 'name', label: 'Product' },
                  { key: 'sku', label: 'SKU' },
                  { key: 'price', label: 'Price', format: (v) => fCurrency(v) },
                  { key: 'lastStock', label: 'Stock' },
                ],
              })
            }
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              categories: MONTHS_LABELS,
              series: MONTHS_LABELS.map(() => outOfStockProducts.length),
            }}
            sx={{ borderLeft: 4, borderColor: 'error.main' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DashboardMetricCard
            title="Critical Stock"
            total={criticalStockProducts.length}
            percent={0}
            onClick={() =>
              openReport({
                title: 'Critical Stock Products',
                description: `${criticalStockProducts.length} products below 50 % of their threshold`,
                rows: criticalStockProducts.map((p) => ({
                  name: p.name,
                  sku: p.sku,
                  stock: p.stock ?? 0,
                  threshold: p.lowStockThreshold ?? 5,
                  price: p.price,
                })),
                columns: [
                  { key: 'name', label: 'Product' },
                  { key: 'sku', label: 'SKU' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'threshold', label: 'Min Threshold' },
                  { key: 'price', label: 'Price', format: (v) => fCurrency(v) },
                ],
              })
            }
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              categories: MONTHS_LABELS,
              series: MONTHS_LABELS.map(() => criticalStockProducts.length),
            }}
            sx={{ borderLeft: 4, borderColor: 'warning.main' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DashboardMetricCard
            title="Low Stock"
            total={lowStockOnly.length}
            percent={0}
            onClick={() =>
              openReport({
                title: 'Low Stock Products',
                description: `${lowStockOnly.length} products approaching their minimum threshold`,
                rows: lowStockOnly.map((p) => ({
                  name: p.name,
                  sku: p.sku,
                  stock: p.stock ?? 0,
                  threshold: p.lowStockThreshold ?? 5,
                  price: p.price,
                })),
                columns: [
                  { key: 'name', label: 'Product' },
                  { key: 'sku', label: 'SKU' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'threshold', label: 'Min Threshold' },
                  { key: 'price', label: 'Price', format: (v) => fCurrency(v) },
                ],
              })
            }
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              categories: MONTHS_LABELS,
              series: MONTHS_LABELS.map(() => lowStockOnly.length),
            }}
            sx={{ borderLeft: 4, borderColor: 'info.main' }}
          />
        </Grid>

        {/* ── Revenue Line Chart ── */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardRevenueChart
            title="Revenue & Orders Trend"
            subheader="Monthly breakdown by year"
            data={yearlySalesData.length > 0 ? yearlySalesData : [{ year: String(selectedYear), revenue: revenueByMonth, orders: Array(12).fill(0) }]}
          />
        </Grid>

        {/* ── Order Status Donut ── */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <DashboardDonutChart
            title="Orders by Status"
            subheader={`${totalOrders} orders in selected range`}
            total={totalOrders}
            series={orderStatusPie.length > 0 ? orderStatusPie : [{ label: 'No orders', value: 1 }]}
          />
        </Grid>

        {/* ── Category Revenue Donut ── */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <DashboardDonutChart
            title="Revenue by Category"
            subheader="Top category revenue in selected range"
            total={Math.round(totalRevenue)}
            series={
              categoryRevenuePie.length > 0
                ? categoryRevenuePie
                : categories.slice(0, 5).map((c) => ({ label: c.name, value: 0 }))
            }
          />
        </Grid>

        {/* ── Product Category Split Donut ── */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <DashboardDonutChart
            title="Products by Category"
            subheader={`${totalProducts} products across ${totalCategories} categories`}
            total={totalProducts}
            series={categories.slice(0, 6).map((cat) => ({
              label: cat.name,
              value: products.filter((p) => p.categoryId === cat.id).length,
            })).filter((s) => s.value > 0)}
          />
        </Grid>

        {/* ── Stock Management Table ── */}
        <Grid size={{ xs: 12 }}>
          <DashboardStockTable
            products={products}
            title="Stock Management"
          />
        </Grid>
      </Grid>

      {/* Report Dialog */}
      <DashboardReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title={reportConfig.title}
        description={reportConfig.description}
        rows={reportConfig.rows}
        columns={reportConfig.columns}
      />
    </DashboardContent>
  );
}
