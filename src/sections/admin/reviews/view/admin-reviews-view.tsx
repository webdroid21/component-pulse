'use client';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useGetAllReviews, useReviewMutations } from 'src/hooks/firebase/use-reviews';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AdminReviewTableRow } from '../admin-review-table-row';

// ----------------------------------------------------------------------

export function AdminReviewsView() {
    const { reviews, loading } = useGetAllReviews();
    const { approveReview, deleteReview } = useReviewMutations();

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Product Reviews"
                links={[
                    { name: 'Dashboard', href: paths.admin.root },
                    { name: 'Reviews' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reviewer</TableCell>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Status</TableCell>
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
                            ) : reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No reviews found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reviews.map((row) => (
                                    <AdminReviewTableRow
                                        key={row.id}
                                        row={row}
                                        onApprove={() => approveReview(row.id, true)}
                                        onReject={() => approveReview(row.id, false)}
                                        onDelete={() => deleteReview(row.id)}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </DashboardContent>
    );
}
