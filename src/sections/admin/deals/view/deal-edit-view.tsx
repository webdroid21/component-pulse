'use client';

import { paths } from 'src/routes/paths';

import { useDeal } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

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
        Deal not found.
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
