'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { AUTH } from 'src/lib/firebase';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { SentIcon, PasswordIcon } from 'src/assets/icons';

import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(8, { message: 'Password must be at least 8 characters!' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter!' })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter!' })
    .regex(/[0-9]/, { message: 'Must contain at least one number!' })
    .regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character!' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required!' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match!",
  path: ['confirmPassword'],
});

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

export function FirebaseAuthActionView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showPassword = useBoolean();

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const handleAction = async () => {
      if (!mode || !oobCode) {
        setErrorMessage('Invalid or missing action link parameters.');
        setLoading(false);
        return;
      }

      if (mode === 'verifyEmail') {
        try {
          await applyActionCode(AUTH, oobCode);
          setSuccess(true);
        } catch (error) {
          console.error('Email verification error', error);
          setErrorMessage(getErrorMessage(error));
        } finally {
          setLoading(false);
        }
      } else if (mode === 'resetPassword') {
        try {
          // Verify code first before revealing the form
          await verifyPasswordResetCode(AUTH, oobCode);
          setLoading(false);
        } catch (error) {
          console.error('Password reset code error', error);
          setErrorMessage('Invalid or expired password reset link.');
          setLoading(false);
        }
      } else {
        setErrorMessage('Unsupported action mode.');
        setLoading(false);
      }
    };

    handleAction();
  }, [mode, oobCode]);

  const onSubmitReset = handleSubmit(async (data) => {
    if (!oobCode) return;
    try {
      setErrorMessage(null);
      await confirmPasswordReset(AUTH, oobCode, data.password);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Success UI
  if (success) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <SentIcon sx={{ mb: 3, mx: 'auto', height: 96 }} />
        <Typography variant="h3" sx={{ mb: 2 }}>
          {mode === 'verifyEmail' ? 'Email Verified!' : 'Password Reset Successful!'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          {mode === 'verifyEmail'
            ? 'Your email address has been successfully verified. You can now access all features of your account.'
            : 'Your password has been securely updated.'}
        </Typography>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="contained"
          onClick={() => router.push(paths.auth.firebase.signIn)}
        >
          Proceed to Sign In
        </Button>
      </Box>
    );
  }

  // Error UI
  if (errorMessage && mode !== 'resetPassword') {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <FormHead
          title="Action Failed"
          description="We couldn't complete your request."
          sx={{ mb: 3 }}
        />
        <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
          {errorMessage}
        </Alert>
        <FormReturnLink href={paths.auth.firebase.signIn} />
      </Box>
    );
  }

  // Reset Password Form UI
  if (mode === 'resetPassword') {
    return (
      <>
        <FormHead
          icon={<PasswordIcon />}
          title="Create new password"
          description="Please enter your new strong password below."
        />

        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Form methods={methods} onSubmit={onSubmitReset}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <Field.Text
              name="password"
              label="New Password"
              placeholder="8+ characters"
              type={showPassword.value ? 'text' : 'password'}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword.onToggle} edge="end">
                        <Iconify
                          icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Field.Text
              name="confirmPassword"
              label="Confirm New Password"
              type={showPassword.value ? 'text' : 'password'}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword.onToggle} edge="end">
                        <Iconify
                          icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Updating password..."
            >
              Update Password
            </Button>
          </Box>
        </Form>

        <FormReturnLink href={paths.auth.firebase.signIn} sx={{ mt: 3 }} />
      </>
    );
  }

  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      Validating...
    </Alert>
  );
}
