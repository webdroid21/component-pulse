'use client';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ReportColumn = {
    key: string;
    label: string;
    format?: (value: any) => string;
};

export type ReportRow = Record<string, any>;

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    rows: ReportRow[];
    columns: ReportColumn[];
};

// ----------------------------------------------------------------------

function exportToCsv(filename: string, columns: ReportColumn[], rows: ReportRow[]) {
    const headers = columns.map((c) => c.label).join(',');
    const body = rows
        .map((row) =>
            columns
                .map((col) => {
                    const raw = row[col.key];
                    const val = col.format ? col.format(raw) : String(raw ?? '');
                    // Wrap in quotes if contains comma/newline
                    return val.includes(',') || val.includes('\n') ? `"${val}"` : val;
                })
                .join(',')
        )
        .join('\n');

    const csv = `${headers}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------

export function DashboardReportDialog({
    open,
    onClose,
    title,
    description,
    rows,
    columns,
}: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    const handleCsvExport = () => {
        exportToCsv(title.replace(/\s+/g, '_').toLowerCase(), columns, rows);
    };

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; }
            h2 { margin-bottom: 8px; }
            p { color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
            th { background: #f5f5f5; font-weight: 600; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          ${description ? `<p>${description}</p>` : ''}
          ${content.innerHTML}
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6">{title}</Typography>
                {description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {description}
                    </Typography>
                )}
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ px: 3, py: 2 }}>
                {rows.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                        <Iconify icon="eva:inbox-outline" width={48} sx={{ mb: 1, opacity: 0.4 }} />
                        <Typography variant="body2">No data available for the selected period.</Typography>
                    </Box>
                ) : (
                    <div ref={printRef}>
                        {/* Summary row */}
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
                            {rows.length} record{rows.length !== 1 ? 's' : ''} found
                        </Typography>

                        {/* Data Table */}
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th
                                                key={col.key}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '8px 12px',
                                                    borderBottom: '2px solid #e0e0e0',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: '#555',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, rowIdx) => (
                                         
                                        <tr key={rowIdx} style={{ backgroundColor: rowIdx % 2 === 0 ? '#fafafa' : '#fff' }}>
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderBottom: '1px solid #eeee',
                                                        fontSize: 13,
                                                        color: '#333',
                                                    }}
                                                >
                                                    {col.format ? col.format(row[col.key]) : String(row[col.key] ?? '—')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </div>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:download-outline" />}
                        onClick={handleCsvExport}
                        disabled={rows.length === 0}
                    >
                        Export CSV
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:printer-outline" />}
                        onClick={handlePrint}
                        disabled={rows.length === 0}
                    >
                        Print / PDF
                    </Button>
                </Stack>
                <Button size="small" variant="contained" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
