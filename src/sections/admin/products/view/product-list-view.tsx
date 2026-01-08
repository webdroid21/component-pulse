'use client';

import type { Product } from 'src/types/product';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useProducts, useProductMutations } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export function ProductListView() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { products, loading, refetch } = useProducts({ search });
  const { deleteProduct, toggleProductStatus, loading: mutating } = useProductMutations();

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      const success = await deleteProduct(deleteId);
      if (success) {
        refetch();
      }
      setDeleteId(null);
    }
  }, [deleteId, deleteProduct, refetch]);

  const handleToggleStatus = useCallback(async (product: Product) => {
    const success = await toggleProductStatus(product.id, !product.isActive);
    if (success) {
      refetch();
    }
  }, [toggleProductStatus, refetch]);

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          component={RouterLink}
          href={paths.admin.products.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={product.images?.[0]?.url || '/assets/placeholder.svg'}
                          alt={product.name}
                          sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{product.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {product.categoryName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.compareAtPrice && (
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                        >
                          {fCurrency(product.compareAtPrice)}
                        </Typography>
                      )}
                      <Typography variant="body2">{fCurrency(product.price)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: product.stock <= (product.lowStockThreshold || 5)
                            ? 'error.main'
                            : 'text.primary',
                        }}
                      >
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isActive}
                        onChange={() => handleToggleStatus(product)}
                        disabled={mutating}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        href={paths.admin.products.edit(product.id)}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteId(product.id)}
                      >
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
        title="Delete Product"
        content="Are you sure you want to delete this product? This action cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
