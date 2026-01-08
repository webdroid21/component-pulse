'use client';

import type { Category, CategoryFormData } from 'src/types/category';

import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useCategories, useCategoryMutations } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type CategoryFormValues = {
  name: string;
  description: string;
  order: number;
  isActive: boolean;
};

// ----------------------------------------------------------------------

export function CategoryListView() {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { categories, loading, refetch } = useCategories();
  const { createCategory, updateCategory, deleteCategory, loading: mutating } = useCategoryMutations();

  const defaultValues: CategoryFormValues = {
    name: '',
    description: '',
    order: categories.length,
    isActive: true,
  };

  const methods = useForm<CategoryFormValues>({
    defaultValues,
  });

  const { register, reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

  const isActive = watch('isActive');

  const handleOpenCreate = () => {
    reset({ ...defaultValues, order: categories.length });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    reset({
      name: category.name,
      description: category.description || '',
      order: category.order,
      isActive: category.isActive,
    });
    setEditCategory(category);
  };

  const handleClose = () => {
    setIsCreateOpen(false);
    setEditCategory(null);
    reset(defaultValues);
  };

  const onSubmit = handleSubmit(async (data) => {
    let success = false;
    const formData: CategoryFormData = {
      name: data.name,
      description: data.description,
      order: Number(data.order),
      isActive: data.isActive,
    };

    if (editCategory) {
      success = await updateCategory(editCategory.id, formData);
    } else {
      const id = await createCategory(formData);
      success = !!id;
    }

    if (success) {
      handleClose();
      refetch();
    }
  });

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      const success = await deleteCategory(deleteId);
      if (success) {
        refetch();
      }
      setDeleteId(null);
    }
  }, [deleteId, deleteCategory, refetch]);

  const handleToggleStatus = useCallback(async (category: Category) => {
    const success = await updateCategory(category.id, { isActive: !category.isActive });
    if (success) {
      refetch();
    }
  }, [updateCategory, refetch]);

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenCreate}
        >
          New Category
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
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
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {category.image && (
                          <Box
                            component="img"
                            src={category.image}
                            alt={category.name}
                            sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle2">{category.name}</Typography>
                          {category.description && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {category.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{category.productCount || 0}</TableCell>
                    <TableCell>{category.order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isActive}
                        onChange={() => handleToggleStatus(category)}
                        disabled={mutating}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdit(category)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(category.id)}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editCategory} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={onSubmit}>
          <DialogTitle>{editCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Category Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
              <TextField
                label="Description"
                {...register('description')}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Display Order"
                type="number"
                {...register('order', { valueAsNumber: true })}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setValue('isActive', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {editCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        content="Are you sure you want to delete this category? Products in this category will need to be reassigned."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
