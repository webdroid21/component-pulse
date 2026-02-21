'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetTickets, useTicketMutations } from 'src/hooks/firebase';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { usePopover } from 'minimal-shared/hooks';
import { CustomPopover } from 'src/components/custom-popover';

import { TicketChatDialog } from 'src/sections/account/tickets/ticket-chat-dialog';

// ----------------------------------------------------------------------

export function AdminTicketsView() {
    const { tickets, loading } = useGetTickets();
    const { updateTicketStatus } = useTicketMutations();

    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [activeMenuTicket, setActiveMenuTicket] = useState<any>(null);

    const popover = usePopover();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, ticket: any) => {
        setActiveMenuTicket(ticket);
        popover.onOpen(event);
    };

    const handleChangeStatus = async (status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
        if (activeMenuTicket) {
            await updateTicketStatus(activeMenuTicket.id, status);
        }
        popover.onClose();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h4" sx={{ mb: 5 }}>
                Support Ticket Triage
            </Typography>

            <Card>
                {tickets.length === 0 ? (
                    <EmptyContent
                        filled
                        title="Inbox Zero"
                        description="There are currently no support tickets."
                        sx={{ py: 10 }}
                    />
                ) : (
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 900 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Reference</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id} hover>
                                            <TableCell>{fDate(ticket.createdAt?.toDate())}</TableCell>

                                            <TableCell>
                                                <Label>{ticket.ticketNumber}</Label>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="subtitle2" noWrap>
                                                    {ticket.contactName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {ticket.contactEmail}
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ minWidth: 200, maxWidth: 300 }}>
                                                <Typography noWrap variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {ticket.subject}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Label
                                                    color={
                                                        (ticket.priority === 'high' && 'error') ||
                                                        (ticket.priority === 'medium' && 'warning') ||
                                                        'default'
                                                    }
                                                >
                                                    {ticket.priority.toUpperCase()}
                                                </Label>
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
                                                    {ticket.status.replace('_', ' ').toUpperCase()}
                                                </Label>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="inherit"
                                                    variant="text"
                                                    startIcon={<Iconify icon="solar:chat-round-line-bold" />}
                                                    onClick={() => setSelectedTicketId(ticket.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Reply
                                                </Button>
                                                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={(e) => handleOpenMenu(e, ticket)}>
                                                    <Iconify icon="eva:more-vertical-fill" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                )}
            </Card>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuItem onClick={() => handleChangeStatus('open')}>
                    <Iconify icon="solar:info-circle-bold" />
                    Mark Open
                </MenuItem>

                <MenuItem onClick={() => handleChangeStatus('in_progress')}>
                    <Iconify icon="solar:history-bold" />
                    Mark In Progress
                </MenuItem>

                <MenuItem onClick={() => handleChangeStatus('resolved')} sx={{ color: 'success.main' }}>
                    <Iconify icon="solar:check-circle-bold" />
                    Mark Resolved
                </MenuItem>

                <MenuItem onClick={() => handleChangeStatus('closed')} sx={{ color: 'error.main' }}>
                    <Iconify icon="solar:close-circle-bold" />
                    Close Ticket
                </MenuItem>
            </CustomPopover>

            {/* REUSE CHAT MODAL FROM ACCOUNT SECTION */}
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
