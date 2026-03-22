import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'minimal-shared/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/firebase/action';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();
  const confirm = useBoolean();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      confirm.onFalse();
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router, confirm]);

  return (
    <>
      <Button
        fullWidth
        variant="soft"
        size="large"
        color="error"
        onClick={confirm.onTrue}
        sx={sx}
        {...other}
      >
        Logout
      </Button>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Logout"
        content="Are you sure you want to log out?"
        action={
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        }
      />
    </>
  );
}
