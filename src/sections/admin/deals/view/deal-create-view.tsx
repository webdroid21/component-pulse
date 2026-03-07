'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DealForm } from '../deal-form';

// ----------------------------------------------------------------------

export function DealCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new deal"
        links={[
          { name: 'Dashboard', href: paths.admin.root },
          { name: 'Deals', href: paths.admin.deals.root },
          { name: 'New deal' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DealForm />
    </DashboardContent>
  );
}
