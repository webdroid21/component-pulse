'use client';

import type { AdminRole } from 'src/hooks/firebase';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useAdmins, useAdminMutations } from 'src/hooks/firebase';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ROLE_OPTIONS: { value: AdminRole; label: string; color: 'error' | 'warning' | 'info' }[] = [
  { value: 'super_admin', label: 'Super Admin', color: 'error' },
  { value: 'admin', label: 'Admin', color: 'warning' },
  { value: 'staff', label: 'Staff', color: 'info' },
];

export function AdminUsersListView() {
  const { admins, loading, refetch } = useAdmins();
  const { updateAdminRole, toggleAdminStatus, deleteAdmin, loading: mutating } = useAdminMutations();

  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('admin');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleRoleChange = async () => {
    if (editingAdmin) {
      const success = await updateAdminRole(editingAdmin, selectedRole);
      if (success) {
        refetch();
        setEditingAdmin(null);
      }
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    const success = await toggleAdminStatus(adminId, !currentStatus);
    if (success) refetch();
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      const success = await deleteAdmin(deleteConfirm);
      if (success) {
        refetch();
        setDeleteConfirm(null);
      }
    }
  };

  const getRoleChip = (role: AdminRole) => {
    const option = ROLE_OPTIONS.find((r) => r.value === role);
    return (
      <Chip
        label={option?.label || role}
        color={option?.color || 'default'}
        size="small"
      />
    );
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Admin Users</Typography>
      </Box>

      <Card>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : admins.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No admin users found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.displayName}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleChip(admin.role)}</TableCell>
                    <TableCell>
                      <Chip
                        label={admin.isActive ? 'Active' : 'Inactive'}
                        color={admin.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingAdmin(admin.id);
                          setSelectedRole(admin.role);
                        }}
                        title="Change Role"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                        title={admin.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Iconify icon="solar:settings-bold" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm(admin.id)}
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

      {/* Edit Role Dialog */}
      <Dialog open={!!editingAdmin} onClose={() => setEditingAdmin(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Admin Role</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
            sx={{ mt: 2 }}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingAdmin(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleRoleChange} disabled={mutating}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Admin User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this admin user? This action cannot be undone.
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
