'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { SimpleLayout } from '../simple';
import { SignOutButton } from '../components/sign-out-button';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Profile', path: paths.account.profile, icon: 'solar:user-circle-bold-duotone' },
  { label: 'My Orders', path: paths.account.orders, icon: 'solar:bag-4-bold-duotone' },
  { label: 'Addresses', path: paths.account.addresses, icon: 'solar:map-point-bold-duotone' },
  { label: 'Tickets', path: paths.account.tickets, icon: 'fluent:chat-20-filled' },
  { label: 'Wishlist', path: paths.account.wishlist, icon: 'solar:heart-bold-duotone' },
];

type AccountLayoutProps = {
  children: React.ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  const { user } = useAuthContext();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Customer';
  const initials = displayName.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2);

  const renderSidebar = (
    <Card sx={{ p: 3 }}>
      {/* User Info */}
      <Stack alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          src={user?.photoURL || ''}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            fontSize: 28,
            bgcolor: 'primary.main',
          }}
        >
          {initials}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {displayName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user?.email}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation */}
      <Stack spacing={0.5}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              href={item.path}
              sx={{
                borderRadius: 1,
                py: 1.5,
                bgcolor: isActive ? 'primary.lighter' : 'transparent',
                color: isActive ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.lighter' : 'action.hover',
                },
              }}
            >
              <Iconify
                icon={item.icon}
                width={22}
                sx={{ mr: 2, color: isActive ? 'primary.main' : 'text.secondary' }}
              />
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Logout Button */}
      <SignOutButton />
    </Card>
  );

  return (
    <SimpleLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, minHeight: '80vh' }}>
        {/* Mobile Header */}
        <Box sx={{ display: { md: 'none' }, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            My Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Welcome back, {displayName}
          </Typography>
        </Box>

        {/* Mobile Navigation */}
        <Box
          sx={{
            display: { md: 'none' },
            mb: 3,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          <Stack direction="row" spacing={1}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <Card
                  key={item.path}
                  component={RouterLink}
                  href={item.path}
                  sx={{
                    px: 2,
                    py: 1.5,
                    minWidth: 100,
                    textAlign: 'center',
                    textDecoration: 'none',
                    bgcolor: isActive ? 'primary.main' : 'background.paper',
                    color: isActive ? 'common.white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <Iconify icon={item.icon} width={24} sx={{ mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </Card>
              );
            })}
          </Stack>
        </Box>

        {/* Desktop Layout */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Sidebar - Desktop only */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, width: 280, flexShrink: 0 }}>
            {renderSidebar}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {children}
          </Box>
        </Box>

        {/* Mobile Logout Button */}
        <Box sx={{ display: { md: 'none' }, mt: 3 }}>
          <SignOutButton />
        </Box>
      </Container>
    </SimpleLayout>
  );
}
