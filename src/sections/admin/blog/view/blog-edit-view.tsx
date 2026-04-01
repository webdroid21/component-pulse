'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { usePost } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlogForm } from '../blog-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function BlogEditView({ id }: Props) {
  const { post, loading } = usePost(id);

  if (loading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit post"
          links={[
            { name: 'Dashboard', href: paths.admin.root },
            { name: 'Blog', href: paths.admin.blog.root },
            { name: id },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!post) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit post"
          links={[
            { name: 'Dashboard', href: paths.admin.root },
            { name: 'Blog', href: paths.admin.blog.root },
            { name: id },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Iconify
            icon="solar:document-text-bold-duotone"
            width={80}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Post not found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            The blog post you&#39;re looking for doesn&#39;t exist or has been removed.
          </Typography>
          <Button component={RouterLink} href={paths.admin.blog.root} variant="contained">
            Back to Posts
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit post"
        links={[
          { name: 'Dashboard', href: paths.admin.root },
          { name: 'Blog', href: paths.admin.blog.root },
          { name: post.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BlogForm currentPost={post} />
    </DashboardContent>
  );
}
