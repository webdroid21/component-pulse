'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDeal } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DealForm } from '../deal-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function DealEditView({ id }: Props) {
  const { deal, loading } = useDeal(id);

  if (loading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit deal"
          links={[
            { name: 'Dashboard', href: paths.admin.root },
            { name: 'Deals', href: paths.admin.deals.root },
            { name: id },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        Loading...
      </DashboardContent>
    );
  }

  if (!deal) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit deal"
          links={[
            { name: 'Dashboard', href: paths.admin.root },
            { name: 'Deals', href: paths.admin.deals.root },
            { name: id },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Iconify icon="solar:box-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Deal not found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            The deal you&apos;re looking for doesn&apos;t exist or has been removed.
          </Typography>
          <Button component={RouterLink} href={paths.admin.deals.root} variant="contained">
            Back to Deals
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit deal"
        links={[
          { name: 'Dashboard', href: paths.admin.root },
          { name: 'Deals', href: paths.admin.deals.root },
          { name: deal.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DealForm currentDeal={deal} />
    </DashboardContent>
  );
}
