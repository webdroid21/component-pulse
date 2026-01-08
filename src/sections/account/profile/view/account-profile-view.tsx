'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useUserProfile, useUserProfileMutations } from 'src/hooks/firebase';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const ProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  newsletter: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

// ----------------------------------------------------------------------

export function AccountProfileView() {
  const { profile, loading, refetch } = useUserProfile();
  const { updateProfile, loading: updating } = useUserProfileMutations();
  const [success, setSuccess] = useState(false);

  const defaultValues: ProfileFormValues = {
    firstName: '',
    lastName: '',
    phone: '',
    gender: undefined,
    newsletter: false,
    emailNotifications: true,
    smsNotifications: true,
  };

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const newsletter = watch('newsletter');
  const emailNotifications = watch('emailNotifications');
  const smsNotifications = watch('smsNotifications');

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        gender: profile.gender,
        newsletter: profile.newsletter || false,
        emailNotifications: profile.notifications?.email ?? true,
        smsNotifications: profile.notifications?.sms ?? true,
      });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const updateSuccess = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      gender: data.gender,
      newsletter: data.newsletter,
      notifications: {
        email: data.emailNotifications,
        sms: data.smsNotifications,
        push: profile?.notifications?.push ?? true,
      },
    });

    if (updateSuccess) {
      setSuccess(true);
      refetch();
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', pt: 5, pb: 3 }}>
                <Avatar
                  src={profile?.photoURL}
                  alt={profile?.displayName}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                >
                  {profile?.displayName?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h6">{profile?.displayName || 'Customer'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {profile?.email}
                </Typography>

                <Button variant="outlined" size="small">
                  Change Photo
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field.Text name="firstName" label="First Name" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field.Text name="lastName" label="Last Name" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field.Text name="phone" label="Phone Number" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Field.Select name="gender" label="Gender">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                      </Field.Select>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Notifications
                  </Typography>

                  <Stack spacing={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={emailNotifications}
                          onChange={(e) => setValue('emailNotifications', e.target.checked)}
                        />
                      }
                      label="Email notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={smsNotifications}
                          onChange={(e) => setValue('smsNotifications', e.target.checked)}
                        />
                      }
                      label="SMS notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newsletter}
                          onChange={(e) => setValue('newsletter', e.target.checked)}
                        />
                      }
                      label="Subscribe to newsletter"
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || updating}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Form>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
