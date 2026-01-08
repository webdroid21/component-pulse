'use client';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export function CartIcon() {
  const checkout = useCheckoutContext();

  const totalItems = checkout?.state?.totalItems || 0;

  return (
    <IconButton
      component={RouterLink}
      href={paths.cart}
      sx={{ position: 'relative' }}
    >
      <Badge
        badgeContent={totalItems}
        color="error"
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            top: 4,
            right: 4,
          },
        }}
      >
        <Iconify icon="solar:cart-3-bold-duotone" width={24} />
      </Badge>
    </IconButton>
  );
}
