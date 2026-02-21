import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useReviewMutations } from 'src/hooks/firebase/use-reviews';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    productId: string;
};

export const ReviewSchema = zod.object({
    rating: zod.number().min(1, 'Rating is required'),
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().email('Must be a valid email address'),
    message: zod.string().min(1, 'Review message is required'),
});

export type ReviewSchemaType = zod.infer<typeof ReviewSchema>;

export function ProductReviewForm({ open, onClose, productId }: Props) {
    const { addReview } = useReviewMutations();

    const methods = useForm<ReviewSchemaType>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: 0,
            name: '',
            email: '',
            message: '',
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await addReview({
                productId,
                ...data,
            });
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    });

    const onCancel = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Write a Review</DialogTitle>

                <DialogContent dividers sx={{ pt: 1, pb: 0 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Your review will be checked by moderation before it appears publicly.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Your Rating
                    </Typography>
                    <Field.Rating name="rating" sx={{ mb: 3 }} />

                    <Field.Text name="name" label="Name" sx={{ mb: 3 }} />
                    <Field.Text name="email" label="Email" sx={{ mb: 3 }} />
                    <Field.Text name="message" label="Review message" multiline rows={4} />
                </DialogContent>

                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Post Review
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
