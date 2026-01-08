import type { AccountDrawerProps } from './components/account-drawer';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Customer account menu items
export const _account: AccountDrawerProps['data'] = [
  { label: 'Home', href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Profile',
    href: paths.account.profile,
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Orders',
    href: paths.account.orders,
    icon: <Iconify icon="solar:bag-5-bold-duotone" />,
  },
  {
    label: 'Addresses',
    href: paths.account.addresses,
    icon: <Iconify icon="solar:map-point-bold-duotone" />,
  },
  {
    label: 'Wishlist',
    href: paths.account.wishlist,
    icon: <Iconify icon="solar:heart-bold-duotone" />,
  },
];

// Admin account menu items
export const _adminAccount: AccountDrawerProps['data'] = [
  { label: 'Home', href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Dashboard',
    href: paths.admin.dashboard,
    icon: <Iconify icon="solar:chart-2-bold-duotone" />,
  },
  {
    label: 'Products',
    href: paths.admin.products.root,
    icon: <Iconify icon="solar:box-bold-duotone" />,
  },
  {
    label: 'Orders',
    href: paths.admin.orders.root,
    icon: <Iconify icon="solar:bag-5-bold-duotone" />,
  },
  {
    label: 'Settings',
    href: paths.admin.settings,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
