'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { useTicketMutations, useGetTicketDetails, useNotificationMutations } from 'src/hooks/firebase';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
    ticketId: string;
    open: boolean;
    onClose: VoidFunction;
};

export function TicketChatDialog({ ticketId, open, onClose }: Props) {
    const { user } = useAuthContext();
    const { ticket, messages, loading } = useGetTicketDetails(ticketId);
    const { sendMessage, loading: sending } = useTicketMutations();
    const { createNotification } = useNotificationMutations();

    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!message.trim() || !user || !ticket) return;

        try {
            await sendMessage(ticketId, {
                senderId: user.uid,
                senderRole: user.isAdmin ? 'admin' : 'user',
                senderName: user.displayName || ticket.contactName || 'User',
                content: message.trim(),
            });

            // If user replies, notify admin
            if (!user.isAdmin) {
                await createNotification({
                    userId: 'admin',
                    type: 'chat',
                    category: `Ticket Reply: ${ticket.ticketNumber}`,
                    title: `<p><strong>${user.displayName || 'User'}</strong> replied to <em>${ticket.subject}</em></p>`,
                    avatarUrl: user.photoURL || null,
                    link: `/admin/tickets?id=${ticketId}`,
                });
            }

            setMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const renderHeader = () => {
        if (!ticket) return null;
        return (
            <Box sx={{ p: 3, borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{ticket.ticketNumber}</Typography>
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
                </Stack>

                <Typography variant="h6" sx={{ mb: 1 }}>
                    {ticket.subject}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ typography: 'caption', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="solar:clock-circle-bold" width={16} sx={{ mr: 0.5 }} />
                        {fDateTime(ticket.createdAt?.toDate())}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="solar:user-bold" width={16} sx={{ mr: 0.5 }} />
                        {ticket.contactName} ({ticket.contactEmail})
                    </Box>
                </Stack>
            </Box>
        );
    };

    const renderMessages = () => (
        <Scrollbar sx={{ p: 3, height: 400 }}>
            <Stack spacing={3}>
                {messages.map((msg) => {
                    const isMe = msg.senderId === user?.uid || msg.senderId === 'ANONYMOUS';

                    return (
                        <Stack key={msg.id} direction="row" justifyContent={isMe ? 'flex-end' : 'flex-start'}>
                            {!isMe && (
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        color: 'common.white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        typography: 'subtitle2',
                                        mr: 2,
                                    }}
                                >
                                    {msg.senderName.charAt(0).toUpperCase()}
                                </Box>
                            )}

                            <Stack alignItems={isMe ? 'flex-end' : 'flex-start'}>
                                <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5 }}>
                                    {!isMe ? msg.senderName : ''} {fToNow(msg.createdAt?.toDate())}
                                </Typography>

                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        typography: 'body2',
                                        bgcolor: isMe ? 'primary.main' : 'background.neutral',
                                        color: isMe ? 'common.white' : 'text.primary',
                                    }}
                                >
                                    {msg.content}
                                </Box>
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </Scrollbar>
    );

    const renderInput = () => {
        if (ticket?.status === 'closed') {
            return (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.neutral' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        This ticket is closed. Please open a new ticket if you need further assistance.
                    </Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ p: 2, borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') handleSend();
                        }}
                    />
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                    >
                        Send
                    </Button>
                </Stack>
            </Box>
        );
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Ticket Thread
                <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </DialogTitle>

            <Divider />

            {loading ? (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {renderHeader()}
                    {renderMessages()}
                    {renderInput()}
                </>
            )}
        </Dialog>
    );
}
