import type { TestimonialItem } from 'src/hooks/firebase/use-testimonials';

import { usePopover } from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
    row: TestimonialItem;
    onApprove: VoidFunction;
    onReject: VoidFunction;
    onDelete: VoidFunction;
};

export function AdminTestimonialTableRow({ row, onApprove, onReject, onDelete }: Props) {
    const { name, role, avatar, rating, content, status } = row;

    const popover = usePopover();

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={name} src={avatar || undefined}>{name.charAt(0).toUpperCase()}</Avatar>
                        <Stack>
                            <Typography variant="subtitle2">{name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {role}
                            </Typography>
                        </Stack>
                    </Stack>
                </TableCell>

                <TableCell>
                    <Rating size="small" value={rating} readOnly precision={0.5} />
                </TableCell>

                <TableCell>
                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: 320,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {content}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'approved' && 'success') ||
                            (status === 'rejected' && 'error') ||
                            'warning'
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Label>
                </TableCell>

                <TableCell align="right" sx={{ px: 1 }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                {status !== 'approved' && (
                    <MenuItem
                        onClick={() => {
                            onApprove();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                        Approve
                    </MenuItem>
                )}

                {status !== 'rejected' && (
                    <MenuItem
                        onClick={() => {
                            onReject();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="eva:minus-circle-fill" sx={{ color: 'warning.main' }} />
                        Reject
                    </MenuItem>
                )}

                <MenuItem
                    onClick={() => {
                        onDelete();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
        </>
    );
}
