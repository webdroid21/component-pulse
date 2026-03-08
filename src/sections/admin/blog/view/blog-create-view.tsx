'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlogForm } from '../blog-form';

// ----------------------------------------------------------------------

export function BlogCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new post"
        links={[
          { name: 'Dashboard', href: paths.admin.root },
          { name: 'Blog', href: paths.admin.blog.root },
          { name: 'New post' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BlogForm />
    </DashboardContent>
  );
}
