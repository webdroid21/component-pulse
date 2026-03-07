'use client';

import { useState } from 'react';

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

import { useDeals, useDealMutations } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export function DealsListView() {
  const { deals, loading } = useDeals();
  const { updateDeal, deleteDeal, loading: mutating } = useDealMutations();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDeal(deleteId);
    setDeleteId(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateDeal(id, { isActive: !currentStatus });
  };

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Combo Deals</Typography>
        <Button
          component={RouterLink}
          href={paths.admin.deals.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Deal
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Deal Name</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Combo Price</TableCell>
                <TableCell>Original Price</TableCell>
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
              ) : deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No deals found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {deal.coverImage ? (
                          <Box
                            component="img"
                            src={deal.coverImage}
                            alt={deal.name}
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
                            <Iconify icon="solar:box-bold" sx={{ color: 'text.secondary' }} />
                          </Box>
                        )}
                        <Typography variant="subtitle2">{deal.name}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {deal.productIds?.length || 0} Products
                        <br />
                        {deal.trainingModuleIds?.length || 0} Modules
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                        {fCurrency(deal.price)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                        {fCurrency(deal.originalPrice)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={deal.isActive}
                        onChange={() => handleToggleStatus(deal.id, deal.isActive)}
                        disabled={mutating}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton component={RouterLink} href={paths.admin.deals.edit(deal.id)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(deal.id)}>
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
        title="Delete Deal"
        content="Are you sure you want to delete this deal? This action cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={mutating}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
