'use client';

import { paths } from 'src/routes/paths';

import { useProduct } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductCreateEditForm } from '../product-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function ProductEditView({ id }: Props) {
  const { product, loading } = useProduct(id);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit product"
        links={[
          { name: 'Dashboard', href: paths.admin.root },
          { name: 'Products', href: paths.admin.products.root },
          { name: product?.name || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {loading ? (
        <div>Loading...</div>
      ) : product ? (
        <ProductCreateEditForm currentProduct={product} />
      ) : (
        <div>Product not found</div>
      )}
    </DashboardContent>
  );
}
