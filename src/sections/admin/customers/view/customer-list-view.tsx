'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
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
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useCustomers, useCustomerMutations } from 'src/hooks/firebase';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CustomerListView() {
  const { customers, loading, refetch } = useCustomers();
  const { toggleCustomerStatus, deleteCustomer, loading: mutating } = useCustomerMutations();

  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
  );

  const handleToggleStatus = async (customerId: string, currentStatus: boolean) => {
    const success = await toggleCustomerStatus(customerId, !currentStatus);
    if (success) refetch();
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      const success = await deleteCustomer(deleteConfirm);
      if (success) {
        refetch();
        setDeleteConfirm(null);
      }
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Customers</Typography>
        <Typography variant="body2" color="text.secondary">
          {customers.length} total customers
        </Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filteredCustomers.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {search ? 'No customers found matching your search' : 'No customers yet'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={customer.photoURL} alt={customer.displayName}>
                          {customer.displayName?.charAt(0) || customer.email?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {customer.displayName || `${customer.firstName} ${customer.lastName}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.addresses?.length || 0} addresses
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {customer.email}
                        {customer.isEmailVerified && (
                          <Iconify icon="eva:checkmark-fill" sx={{ color: 'success.main', width: 16 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>
                      {customer.createdAt ? fDate(customer.createdAt.toDate()) : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.isActive ? 'Active' : 'Inactive'}
                        color={customer.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                        title={customer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Iconify icon="solar:settings-bold" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm(customer.id)}
                        title="Delete"
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer? This will also delete their orders and data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
