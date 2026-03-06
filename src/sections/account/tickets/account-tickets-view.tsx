'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetUserTickets } from 'src/hooks/firebase';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';

import { TicketChatDialog } from './ticket-chat-dialog';

// ----------------------------------------------------------------------

export function AccountTicketsView() {
    const { tickets, loading } = useGetUserTickets();

    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Contact Support
            </Typography>

            <Card>
                {tickets.length === 0 ? (
                    <EmptyContent
                        filled
                        title="No tickets found"
                        description="You haven't submitted any support requests yet."
                        sx={{ py: 10 }}
                    />
                ) : (
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Contact ID No.</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id} hover>
                                            <TableCell>{fDate(ticket.createdAt?.toDate())}</TableCell>

                                            <TableCell>
                                                <Typography variant="subtitle2">{ticket.ticketNumber}</Typography>
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 200, maxWidth: 350 }}>
                                                <Typography noWrap variant="body2">
                                                    {ticket.subject}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Label
                                                    variant="soft"
                                                    color={
                                                        (ticket.status === 'open' && 'info') ||
                                                        (ticket.status === 'in_progress' && 'warning') ||
                                                        (ticket.status === 'resolved' && 'success') ||
                                                        'default'
                                                    }
                                                >
                                                    {ticket.status.replace('_', ' ')}
                                                </Label>
                                            </TableCell>

                                            <TableCell>
                                                <Label
                                                    variant="outlined"
                                                    color={
                                                        (ticket.priority === 'high' && 'error') ||
                                                        (ticket.priority === 'medium' && 'warning') ||
                                                        'default'
                                                    }
                                                >
                                                    {ticket.priority}
                                                </Label>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="inherit"
                                                    variant="outlined"
                                                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                                                    onClick={() => setSelectedTicketId(ticket.id)}
                                                >
                                                    View Thread
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                )}
            </Card>

            {/* CHAT MODAL OVERLAY */}
            {selectedTicketId && (
                <TicketChatDialog
                    ticketId={selectedTicketId}
                    open={!!selectedTicketId}
                    onClose={() => setSelectedTicketId(null)}
                />
            )}
        </>
    );
}
