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

import { useGetAllTestimonials, useTestimonialMutations } from 'src/hooks/firebase/use-testimonials';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AdminTestimonialTableRow } from '../admin-testimonial-table-row';

// ----------------------------------------------------------------------

export function AdminTestimonialsView() {
    const { testimonials, loading } = useGetAllTestimonials();
    const { updateTestimonialStatus, deleteTestimonial } = useTestimonialMutations();

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Testimonials"
                links={[
                    { name: 'Dashboard', href: paths.admin.root },
                    { name: 'Testimonials' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : testimonials.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No testimonials found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                testimonials.map((row) => (
                                    <AdminTestimonialTableRow
                                        key={row.id}
                                        row={row}
                                        onApprove={() => updateTestimonialStatus(row.id, 'approved')}
                                        onReject={() => updateTestimonialStatus(row.id, 'rejected')}
                                        onDelete={() => deleteTestimonial(row.id)}
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
