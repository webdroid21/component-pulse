'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { useTicketMutations } from 'src/hooks/firebase';
import { useNotificationMutations } from 'src/hooks/firebase';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type SupportContactSchemaType = zod.infer<typeof SupportContactSchema>;

export const SupportContactSchema = zod.object({
    contactName: zod.string().min(1, { message: 'Name is required' }),
    contactEmail: zod
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email must be a valid email address' }),
    subject: zod.string().min(1, { message: 'Subject is required' }),
    message: zod.string().min(1, { message: 'Message is required' }),
});

// ----------------------------------------------------------------------

export function SupportContactForm() {
    const { user } = useAuthContext();
    const { createTicket, loading: isSubmitting } = useTicketMutations();
    const { createNotification } = useNotificationMutations();

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const defaultValues = {
        contactName: user?.displayName || '',
        contactEmail: user?.email || '',
        subject: '',
        message: '',
    };

    const methods = useForm<SupportContactSchemaType>({
        resolver: zodResolver(SupportContactSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting: rhfSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createTicket(
                {
                    subject: data.subject,
                    contactName: data.contactName,
                    contactEmail: data.contactEmail,
                    userId: user?.uid || null,
                },
                data.message
            );

            // Notify admins that a new ticket arrived
            await createNotification({
                userId: 'admin',
                type: 'mail',
                category: 'New Support Ticket',
                title: `<p><strong>${data.contactName}</strong> submitted a new support ticket: <em>${data.subject}</em></p>`,
                avatarUrl: null,
                link: '/admin/tickets',
            });

            reset();
            setOpenSuccess(true);
        } catch (error) {
            console.error('Error submitting ticket:', error);
            setOpenError(true);
        }
    });

    return (
        <Card sx={{ p: { xs: 3, md: 5 }, mb: { xs: 10, md: 15 } }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Send Us A Message
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    Have a specific question or issue? Fill out the form below and our team will get back to you!
                </Typography>
            </Box>

            {!user && (
                <Alert severity="info" sx={{ mb: 4 }}>
                    Did you know? If you <strong>create an account</strong> or <strong>sign in</strong>, you can track the status of your support tickets directly from your dashboard!
                </Alert>
            )}

            <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <Field.Text name="contactName" label="Full Name" />
                        <Field.Text name="contactEmail" label="Email Address" />
                    </Box>

                    <Field.Text name="subject" label="Subject" />

                    <Field.Text name="message" label="Message" multiline rows={4} />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || rhfSubmitting}
                    >
                        Submit Ticket
                    </LoadingButton>
                </Stack>
            </Form>

            <Snackbar
                open={openSuccess}
                autoHideDuration={6000}
                onClose={() => setOpenSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setOpenSuccess(false)}>
                    Message sent successfully! Our team will reply shortly.
                </Alert>
            </Snackbar>

            <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={() => setOpenError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setOpenError(false)}>
                    Failed to send message. Please try again.
                </Alert>
            </Snackbar>
        </Card>
    );
}
