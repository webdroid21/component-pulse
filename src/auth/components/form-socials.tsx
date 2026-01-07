import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormSocialsProps = BoxProps & {
  signInWithGoogle?: () => void;
};

export function FormSocials({ sx, signInWithGoogle, ...other }: FormSocialsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'flex',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        size="large"
        onClick={signInWithGoogle}
        startIcon={<Iconify width={22} icon="socials:google" />}
      >
        Continue with Google
      </Button>
    </Box>
  );
}
