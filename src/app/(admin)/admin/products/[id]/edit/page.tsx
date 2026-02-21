import type { Metadata } from 'next';

import { ProductEditView } from 'src/sections/admin/products/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: 'Edit Product | Admin' };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;

  return <ProductEditView id={id} />;
}
