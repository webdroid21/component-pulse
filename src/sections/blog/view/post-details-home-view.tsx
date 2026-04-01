'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { usePost, usePosts } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductReviews } from 'src/sections/shop/product-reviews';

import { PostItem } from '../post-item';
import { PostDetailsHero } from '../post-details-hero';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function PostDetailsHomeView({ id }: Props) {
  const { post, loading } = usePost(id);
  const { posts: latestPosts } = usePosts({ publish: true, limit: 4 });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
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
        <Button component={RouterLink} href={paths.blog.root} variant="contained">
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <>
      <PostDetailsHero
        title={post.title}
        coverUrl={post.coverUrl || '/assets/placeholder.svg'}
        createdAt={post.createdAt?.toDate?.() || new Date()}
      />

      <Container
        maxWidth={false}
        sx={[
          (theme) => ({ py: 3, mb: 5, borderBottom: `solid 1px ${theme.vars.palette.divider}` }),
        ]}
      >
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: paths.blog.root },
            { name: post.title },
          ]}
          sx={{ maxWidth: 720, mx: 'auto' }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 5 }}>
            {post.description}
          </Typography>

          <Markdown children={post.content} />

          <Stack
            spacing={3}
            sx={[
              (theme) => ({
                py: 3,
                mt: 5,
                borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              }),
            ]}
          >
            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              {post.tags?.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Box>
          </Stack>

          {post.enableComments && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h4" sx={{ mb: 5 }}>
                Comments & Reviews
              </Typography>
              {/* Reusing ProductReviews component as it stores and handles generic productId (or postId) reviews */}
              <ProductReviews productId={post.id} />
            </Box>
          )}
        </Stack>
      </Container>

      {!!latestPosts?.length && (
        <Container sx={{ pb: 15, mt: 10 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Recent Posts
          </Typography>

          <Grid container spacing={3}>
            {latestPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 4)
              .map((latestPost) => (
                <Grid
                  key={latestPost.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                  }}
                >
                  <PostItem post={latestPost} detailsHref={paths.blog.details(latestPost.id)} />
                </Grid>
              ))}
          </Grid>
        </Container>
      )}
    </>
  );
}
