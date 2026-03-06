'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { MainSectionProps, LayoutSectionProps, HeaderSectionProps } from '../core';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useNewsletter, useGetNotifications } from 'src/hooks/firebase';

import { Logo } from 'src/components/logo';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { CartIcon } from './cart-icon';
import { HeaderSearch } from './header-search';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { _account, _adminAccount } from '../nav-config-account';
import { MainSection, LayoutSection, HeaderSection } from '../core';
import { NotificationsDrawer } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

function NewsletterForm() {
  const { subscribe, loading } = useNewsletter();
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const success = await subscribe(email);
    if (success) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    } else {
      toast.error('Failed to subscribe or already subscribed.');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', gap: 1, width: '100%' }}>
      <TextField
        fullWidth
        name="email"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          bgcolor: 'common.white',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={loading}
        sx={{
          whiteSpace: 'nowrap',
          px: 3,
        }}
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </Box>
  );
}

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { title: 'Categories', path: paths.products },
  { title: 'Products', path: paths.products },
  { title: 'Deals', path: paths.products },
  { title: 'Training', path: paths.trainingModules.root },
  { title: 'About', path: paths.about },
  { title: 'Contact & Support', path: paths.support },
];

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  hasFooter?: boolean;
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
  hasFooter = true,
}: MainLayoutProps) {
  const pathname = usePathname();
  const { user, authenticated } = useAuthContext();
  const { notifications } = useGetNotifications();

  const { value: mobileOpen, onFalse: onMobileClose, onTrue: onMobileOpen } = useBoolean();


  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const renderMobileNav = () => (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={onMobileClose}
      slotProps={{ paper: { sx: { width: 280 } } }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <IconButton onClick={onMobileClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              component={RouterLink}
              href={item.path}
              onClick={onMobileClose}
              selected={pathname === item.path}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {authenticated ? (
          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            href={user?.isAdmin ? paths.admin.dashboard : paths.account.root}
          >
            {user?.isAdmin ? 'Dashboard' : 'My Account'}
          </Button>
        ) : (
          <Stack spacing={1}>
            <Button fullWidth variant="contained" component={RouterLink} href={paths.auth.firebase.signIn}>
              Sign In
            </Button>
            <Button fullWidth variant="outlined" component={RouterLink} href={paths.auth.firebase.signUp}>
              Sign Up
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: 'lg',
      },
      centerArea: {
        sx: {
          px: { xs: 2, md: 5 },
        }
      }
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Box
          sx={{
            py: 1,
            px: 3,
            bgcolor: 'grey.900',
            color: 'common.white',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            typography: 'caption',
          }}
        >
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Iconify icon="solar:phone-bold" />
              +256 790 270 840
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#25D366' }}>
              <Iconify icon="logos:whatsapp-icon" />
              Chat on WhatsApp
            </Box>
          </Box>
          <Box>Free delivery within Kampala for orders above UGX 500,000</Box>
        </Box>
      ),
      leftArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onMobileOpen} sx={{ display: { [layoutQuery]: 'none' } }}>
            <Iconify icon="solar:hamburger-menu-bold-duotone" width={24} />
          </IconButton>
          {mdUp ? <Logo isSingle={false} /> : <Logo />}
        </Box>
      ),
      centerArea: (
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', maxWidth: 700 }}>
          <HeaderSearch />
        </Box>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <SettingsButton />

          <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 1 } }}>
            <CartIcon />
            <Box sx={{ ml: 1, typography: 'subtitle2', display: { xs: 'none', sm: 'block' } }}>
              Cart
            </Box>
          </Box>

          {authenticated ? (
            <>
              <NotificationsDrawer data={notifications} />
              <AccountDrawer data={user?.isAdmin ? _adminAccount : _account} />
            </>
          ) : (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                href={paths.auth.firebase.signIn}
                color="inherit"
                startIcon={<Iconify icon="solar:user-circle-bold" />}
              >
                Account
              </Button>
            </Box>
          )}
        </Box>
      ),
      bottomArea: (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', display: { xs: 'none', md: 'block' } }}>
          <Container maxWidth="lg">
            <Box component="nav" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, py: 1.5 }}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  component={RouterLink}
                  href={item.path}
                  color={pathname === item.path ? 'primary' : 'text.primary'}
                  underline="none"
                  sx={{
                    typography: 'subtitle2',
                    fontWeight: pathname === item.path ? 700 : 600,
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </Box>
          </Container>
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={{
          ...headerSlotProps,
          ...slotProps?.header?.slotProps,
        }}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => (
    <Box
      component="footer"
      sx={{
        pb: 8,
        bgcolor: 'grey.900',
        color: 'common.white',
      }}
    >
      {/* Pre-Footer Newsletter Section */}
      <Box sx={{ bgcolor: 'primary.dark', py: 6, mb: 8 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ color: 'primary.contrastText', mb: 1 }}>
                Subscribe to our Newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.contrastText', opacity: 0.8 }}>
                Get the latest updates on new products and upcoming sales directly in your inbox.
              </Typography>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 400 } }}>
              <NewsletterForm />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: 5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {/* Company Info */}
          <Box>
            <Logo isSingle={false} sx={{ mb: 3 }} />
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Your trusted source for quality electronic components, solar equipment, and electrical supplies in Uganda.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Iconify icon="mdi:facebook" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Iconify icon="mdi:twitter" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Iconify icon="mdi:instagram" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Iconify icon="mdi:whatsapp" />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
            <Stack spacing={1}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  component={RouterLink}
                  href={item.path}
                  color="grey.400"
                  underline="hover"
                  sx={{ typography: 'body2' }}
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Customer Service */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Customer Service</Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} href={paths.account.orders} color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                Track Order
              </Link>
              <Link component={RouterLink} href={paths.support} color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                Support Center
              </Link>
              <Link component={RouterLink} href="/terms" color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                Terms & Conditions
              </Link>
              <Link component={RouterLink} href="/privacy" color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                Privacy Policy
              </Link>
            </Stack>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Iconify icon="solar:map-point-bold" sx={{ color: 'primary.main', mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  Plot 123, Industrial Area<br />
                  Kampala, Uganda
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:phone-bold" sx={{ color: 'primary.main' }} />
                <Link href="tel:+256700000000" color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                  +256 700 000 000
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:letter-bold" sx={{ color: 'primary.main' }} />
                <Link href="mailto:info@componentpulse.com" color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                  info@componentpulse.com
                </Link>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} ComponentPulse. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" sx={{ height: 24, filter: 'brightness(0) invert(1)' }} />
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" sx={{ height: 24 }} />
            <Box component="img" src="https://flutterwave.com/images/logo/logo-mark/full.svg" alt="Flutterwave" sx={{ height: 24 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <>
      {renderMobileNav()}
      <LayoutSection
        headerSection={renderHeader()}
        footerSection={hasFooter && renderFooter()}
        cssVars={cssVars}
        sx={sx}
      >
        {renderMain()}
      </LayoutSection>
    </>
  );
}
