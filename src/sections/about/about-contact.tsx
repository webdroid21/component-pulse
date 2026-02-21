'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

export function AboutContact() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" sx={{ mb: 2 }}>
                            Get In Touch
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto' }}>
                            Have questions about our products or services? We&apos;re here to help you succeed.
                        </Typography>
                    </m.div>
                </Box>

                <Grid container spacing={3} sx={{ mb: { xs: 8, md: 10 } }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Iconify icon="solar:cart-large-minimalistic-bold-duotone" width={48} sx={{ color: 'primary.main', mx: 'auto', mb: 3 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>Online Store</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Serving customers across Uganda</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>Online orders and delivery available</Typography>

                            <Button component={RouterLink} href={paths.products} variant="outlined" color="inherit">
                                View Products
                            </Button>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Iconify icon="solar:phone-bold-duotone" width={48} sx={{ color: 'info.main', mx: 'auto', mb: 3 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>Call Us</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>+256 790 270 840</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>Mon-Fri: 8AM-6PM</Typography>

                            <Button href="tel:+256790270840" variant="outlined" color="inherit">
                                +256 790 270 840
                            </Button>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Iconify icon="solar:letter-bold-duotone" width={48} sx={{ color: 'warning.main', mx: 'auto', mb: 3 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>Email Us</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>componentpulse@gmail.com</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>support@componentPulse.ug</Typography>

                            <Button href="mailto:support@componentPulse.ug" variant="outlined" color="inherit">
                                Email Us for Support
                            </Button>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{
                    p: 6,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    textAlign: { xs: 'center', md: 'left' },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{ mb: { xs: 3, md: 0 }, maxWidth: 540 }}>
                        <Typography variant="h3" sx={{ mb: 2 }}>Ready to Start Your Project?</Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            Browse our extensive catalog of electronic components or get in touch for personalized recommendations.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                            component={RouterLink}
                            href={paths.products}
                            variant="contained"
                            size="large"
                            color="inherit"
                        >
                            Browse Products
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.support}
                            variant="outlined"
                            size="large"
                            color="inherit"
                            sx={{ borderColor: 'common.white' }}
                        >
                            Contact Expert
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
