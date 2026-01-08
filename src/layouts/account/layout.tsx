'use client';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import { SimpleLayout } from '../simple';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Profile', path: paths.account.profile },
  { label: 'Orders', path: paths.account.orders },
  { label: 'Addresses', path: paths.account.addresses },
  { label: 'Wishlist', path: paths.account.wishlist },
];

type AccountLayoutProps = {
  children: React.ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  const { user } = useAuthContext();

  const currentTab = NAV_ITEMS.find((item) => pathname.includes(item.path))?.path || paths.account.profile;

  return (
    <SimpleLayout>
      <Container maxWidth="lg" sx={{ py: 5, minHeight: '80vh' }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            My Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Welcome back, {user?.displayName || user?.email || 'Customer'}
          </Typography>
        </Box>

        <Tabs value={currentTab} sx={{ mb: 5 }}>
          {NAV_ITEMS.map((item) => (
            <Tab
              key={item.path}
              label={item.label}
              value={item.path}
              component={RouterLink}
              href={item.path}
            />
          ))}
        </Tabs>

        {children}
      </Container>
    </SimpleLayout>
  );
}
