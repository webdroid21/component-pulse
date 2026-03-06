'use client';

import type { Product } from 'src/types/product';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { varAlpha } from 'minimal-shared/utils';

import { useTheme } from '@mui/material/styles';

import { fCurrency } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { useProductMutations } from 'src/hooks/firebase';

// ----------------------------------------------------------------------

type StockStatus = 'out_of_stock' | 'critical' | 'low' | 'ok';

function getStockStatus(stock: number, threshold: number): StockStatus {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= Math.ceil(threshold * 0.5)) return 'critical';
    if (stock <= threshold) return 'low';
    return 'ok';
}

const STATUS_CONFIG: Record<StockStatus, { label: string; color: 'error' | 'warning' | 'info' | 'success'; progressColor: string }> = {
    out_of_stock: { label: 'Out of Stock', color: 'error', progressColor: '#ff4842' },
    critical: { label: 'Critical', color: 'error', progressColor: '#ff7849' },
    low: { label: 'Low Stock', color: 'warning', progressColor: '#ffc107' },
    ok: { label: 'In Stock', color: 'success', progressColor: '#54d62c' },
};

// ----------------------------------------------------------------------

type AdjustDialogProps = {
    product: Product | null;
    open: boolean;
    onClose: () => void;
};

function StockAdjustDialog({ product, open, onClose }: AdjustDialogProps) {
    const [newStock, setNewStock] = useState('');
    const [note, setNote] = useState('');
    const { updateProduct, loading } = useProductMutations();

    const handleConfirm = async () => {
        if (!product) return;
        const val = parseInt(newStock, 10);
        if (Number.isNaN(val) || val < 0) {
            toast.error('Please enter a valid stock quantity (≥ 0)');
            return;
        }
        const ok = await updateProduct(product.id, { stock: val });
        if (ok) {
            toast.success(`Stock updated to ${val} for "${product.name}"`);
            setNewStock('');
            setNote('');
            onClose();
        } else {
            toast.error('Failed to update stock. Please try again.');
        }
    };

    const handleClose = () => {
        setNewStock('');
        setNote('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {product && (
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                            <Avatar
                                variant="rounded"
                                src={product.images?.[0]?.url}
                                sx={{ width: 48, height: 48 }}
                            />
                            <Box>
                                <Typography variant="subtitle2">{product.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Current stock: <strong>{product.stock ?? 0}</strong>
                                </Typography>
                            </Box>
                        </Box>

                        <TextField
                            label="New Stock Quantity"
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            inputProps={{ min: 0 }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">units</InputAdornment>,
                            }}
                            fullWidth
                            autoFocus
                        />

                        <TextField
                            label="Reason / Note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                            placeholder="e.g. Restocked from supplier #42"
                        />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleConfirm} disabled={loading || !newStock}>
                    {loading ? 'Saving…' : 'Update Stock'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ----------------------------------------------------------------------

type Props = {
    products: Product[];
    filterStatus?: StockStatus[];
    title?: string;
    maxRows?: number;
};

export function DashboardStockTable({ products, filterStatus, title, maxRows }: Props) {
    const theme = useTheme();
    const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
    const [search, setSearch] = useState('');

    const filtered = products
        .filter((p) => {
            const stock = p.stock ?? 0;
            const threshold = p.lowStockThreshold ?? 5;
            const status = getStockStatus(stock, threshold);
            if (filterStatus && !filterStatus.includes(status)) return false;
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
        .slice(0, maxRows);

    return (
        <Card>
            <CardHeader
                title={title ?? 'Stock Levels'}
                subheader={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
                action={
                    <TextField
                        size="small"
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-outline" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 180 }}
                    />
                }
            />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 600 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((product) => {
                                    const stock = product.stock ?? 0;
                                    const threshold = product.lowStockThreshold ?? 5;
                                    const status = getStockStatus(stock, threshold);
                                    const config = STATUS_CONFIG[status];
                                    const pct = threshold > 0 ? Math.min((stock / (threshold * 2)) * 100, 100) : stock > 0 ? 100 : 0;

                                    return (
                                        <TableRow key={product.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={product.images?.[0]?.url}
                                                        sx={{ width: 36, height: 36, flexShrink: 0, bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08) }}
                                                    />
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                                        {product.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                                                {product.sku}
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                                                {product.categoryName ?? '—'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: status === 'out_of_stock' ? 'error.main' : 'inherit' }}
                                                >
                                                    {stock}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 100 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={pct}
                                                    sx={[
                                                        (t) => ({
                                                            height: 6,
                                                            borderRadius: 1,
                                                            bgcolor: varAlpha(t.vars.palette.grey['500Channel'], 0.16),
                                                            '& .MuiLinearProgress-bar': { bgcolor: config.progressColor },
                                                        }),
                                                    ]}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={config.label}
                                                    size="small"
                                                    color={config.color}
                                                    variant="soft"
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: 13 }}>
                                                {fCurrency(product.price)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    title="Adjust Stock"
                                                    onClick={() => setAdjustTarget(product)}
                                                >
                                                    <Iconify icon="eva:edit-2-outline" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>

            <StockAdjustDialog
                product={adjustTarget}
                open={!!adjustTarget}
                onClose={() => setAdjustTarget(null)}
            />
        </Card>
    );
}
