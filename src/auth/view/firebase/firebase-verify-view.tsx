'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { EmailInboxIcon } from 'src/assets/icons';

import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { resendVerificationEmail } from '../../context/firebase';

// ----------------------------------------------------------------------

export function FirebaseVerifyView() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setErrorMessage(null);
      await resendVerificationEmail();
      setResendSuccess(true);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={
          <>
            We&apos;ve sent a verification link to <strong>{email}</strong>.
            <br />
            Please click the link in the email to verify your account.
          </>
        }
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Verification email sent successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Didn&apos;t receive the email? Check your spam folder or
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={handleResendEmail}
          disabled={isResending}
        >
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
      </Box>

      <FormReturnLink href={paths.auth.firebase.signIn} sx={{ mt: 3 }} />
    </>
  );
}
