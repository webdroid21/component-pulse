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
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

import { useCategories, useCategoryMutations } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type CategoryFormValues = {
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
};

const DEFAULT_COLOR = '#2196F3';
const DEFAULT_ICON = 'solar:box-bold-duotone';

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
    icon: DEFAULT_ICON,
    color: DEFAULT_COLOR,
    order: categories.length,
    isActive: true,
  };

  const methods = useForm<CategoryFormValues>({
    defaultValues,
  });

  const { register, reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

  const isActive = watch('isActive');
  const watchedIcon = watch('icon');
  const watchedColor = watch('color');

  const handleOpenCreate = () => {
    reset({ ...defaultValues, order: categories.length });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    reset({
      name: category.name,
      description: category.description || '',
      icon: category.icon || DEFAULT_ICON,
      color: category.color || DEFAULT_COLOR,
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
      icon: data.icon,
      color: data.color,
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
                        {/* Icon + color swatch */}
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: category.color ? `${category.color}22` : 'action.hover',
                            flexShrink: 0,
                          }}
                        >
                          <Iconify
                            icon={category.icon || 'solar:box-bold-duotone'}
                            width={24}
                            sx={{ color: category.color || 'text.secondary' }}
                          />
                        </Box>
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
                rows={2}
                fullWidth
              />

              {/* Icon field with live preview */}
              <TextField
                label="Icon (Iconify name)"
                placeholder="solar:cpu-bolt-bold-duotone"
                {...register('icon')}
                fullWidth
                helperText={
                  <span>
                    Browse icons at{' '}
                    <a
                      href="https://icon-sets.iconify.design"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      icon-sets.iconify.design
                    </a>
                  </span>
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title={watchedIcon || 'icon preview'}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: watchedColor ? `${watchedColor}22` : 'action.hover',
                          }}
                        >
                          <Iconify
                            icon={watchedIcon || 'solar:box-bold-duotone'}
                            width={20}
                            sx={{ color: watchedColor || 'text.secondary' }}
                          />
                        </Box>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Color picker */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Tooltip title="Pick a color">
                  <Box
                    component="input"
                    type="color"
                    value={watchedColor || DEFAULT_COLOR}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValue('color', e.target.value)
                    }
                    sx={{
                      width: 48,
                      height: 48,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      p: 0.5,
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
                <TextField
                  label="Color (hex)"
                  {...register('color')}
                  placeholder="#2196F3"
                  fullWidth
                  onChange={(e) => setValue('color', e.target.value)}
                />
              </Box>

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
