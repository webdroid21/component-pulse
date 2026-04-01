'use client';

import { useState } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { usePosts, usePostMutations } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export function BlogListView() {
  const { posts, loading } = usePosts();
  const { updatePost, deletePost, loading: mutating } = usePostMutations();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePost(deleteId);
    setDeleteId(null);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await updatePost(id, { publish: !currentStatus });
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Blog Posts</Typography>
        <Button
          component={RouterLink}
          href={paths.admin.blog.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Post
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post Title</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No blog posts found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {post.coverUrl ? (
                          <Box
                            component="img"
                            src={post.coverUrl}
                            alt={post.title}
                            sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1,
                              bgcolor: 'background.neutral',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify
                              icon="solar:document-text-bold"
                              sx={{ color: 'text.secondary' }}
                            />
                          </Box>
                        )}
                        <Box>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
                            {post.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: 300,
                            }}
                          >
                            {post.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Label key={tag} variant="soft" color="info">
                            {tag}
                          </Label>
                        ))}
                        {post.tags?.length > 2 && (
                          <Label variant="soft">+{post.tags.length - 2}</Label>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {post.createdAt ? format(post.createdAt.toDate(), 'dd MMM yyyy') : 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={post.publish}
                        onChange={() => handleTogglePublish(post.id, post.publish)}
                        disabled={mutating}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton component={RouterLink} href={paths.admin.blog.edit(post.id)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(post.id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
