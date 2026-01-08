'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SUBJECTS = [
  'General Inquiry',
  'Product Question',
  'Bulk Order',
  'Technical Support',
  'Returns & Refunds',
  'Partnership',
  'Other',
];

const CONTACT_INFO = [
  {
    icon: 'solar:map-point-bold-duotone',
    title: 'Visit Us',
    content: 'Plot 123, Industrial Area\nKampala, Uganda',
    color: '#2196F3',
  },
  {
    icon: 'solar:phone-bold-duotone',
    title: 'Call Us',
    content: '+256 700 000 000\n+256 800 000 000',
    color: '#4CAF50',
  },
  {
    icon: 'solar:letter-bold-duotone',
    title: 'Email Us',
    content: 'info@componentpulse.com\nsales@componentpulse.com',
    color: '#FF9800',
  },
  {
    icon: 'solar:clock-circle-bold-duotone',
    title: 'Working Hours',
    content: 'Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM',
    color: '#9C27B0',
  },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h3" sx={{ mb: 4 }}>
                Contact Information
              </Typography>

              <Stack spacing={3}>
                {CONTACT_INFO.map((info) => (
                  <Box key={info.title} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${info.color}15`,
                      }}
                    >
                      <Iconify icon={info.icon} width={24} sx={{ color: info.color }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        {info.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                        {info.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              {/* Social Links */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Follow Us
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[
                    { icon: 'mdi:facebook', color: '#1877F2' },
                    { icon: 'mdi:twitter', color: '#1DA1F2' },
                    { icon: 'mdi:instagram', color: '#E4405F' },
                    { icon: 'mdi:whatsapp', color: '#25D366' },
                  ].map((social) => (
                    <Box
                      key={social.icon}
                      component="a"
                      href="#"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${social.color}15`,
                        color: social.color,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: social.color,
                          color: 'common.white',
                        },
                      }}
                    >
                      <Iconify icon={social.icon} width={20} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </m.div>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{ p: 4 }}>
                <Typography variant="h3" sx={{ mb: 4 }}>
                  Send Us a Message
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        {SUBJECTS.map((subject) => (
                          <MenuItem key={subject} value={subject}>
                            {subject}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? null : <Iconify icon="solar:letter-bold" />}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </m.div>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Message sent successfully! We&apos;ll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
}
