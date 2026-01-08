'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { MainSectionProps, LayoutSectionProps, HeaderSectionProps } from '../core';

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
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { CartIcon } from './cart-icon';
import { SettingsButton } from '../components/settings-button';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { title: 'Home', path: '/' },
  { title: 'Shop', path: paths.products },
  { title: 'About', path: paths.about },
  { title: 'Contact', path: paths.contact },
  { title: 'FAQs', path: paths.faqs },
];

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
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
}: MainLayoutProps) {
  const pathname = usePathname();
  const { user, authenticated } = useAuthContext();

  const { value: mobileOpen, onFalse: onMobileClose, onTrue: onMobileOpen } = useBoolean();

  const isHomePage = pathname === '/';

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
    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Box
          sx={{
            py: 0.75,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption">
                ⚡ Free shipping on orders over UGX 500,000
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link href="tel:+256700000000" color="inherit" underline="hover" sx={{ typography: 'caption' }}>
                  📞 +256 700 000 000
                </Link>
                <Link href="mailto:info@componentpulse.com" color="inherit" underline="hover" sx={{ typography: 'caption' }}>
                  ✉️ info@componentpulse.com
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      ),
      leftArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onMobileOpen}
            sx={{ display: { [layoutQuery]: 'none' } }}
          >
            <Iconify icon="solar:hamburger-menu-bold-duotone" width={24} />
          </IconButton>
          <Logo />
        </Box>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Desktop Navigation */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', [layoutQuery]: 'flex' },
              alignItems: 'center',
              gap: 3,
              mr: 3,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.title}
                component={RouterLink}
                href={item.path}
                color={pathname === item.path ? 'primary' : 'inherit'}
                underline="none"
                sx={{
                  typography: 'subtitle2',
                  fontWeight: pathname === item.path ? 700 : 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.title}
              </Link>
            ))}
          </Box>

          {/* Cart Icon */}
          <CartIcon />

          {/* Settings */}
          <SettingsButton />

          {/* Auth buttons */}
          {authenticated ? (
            <Button
              variant="outlined"
              size="small"
              component={RouterLink}
              href={user?.isAdmin ? paths.admin.dashboard : paths.account.root}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {user?.isAdmin ? 'Dashboard' : 'Account'}
            </Button>
          ) : (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                component={RouterLink}
                href={paths.auth.firebase.signIn}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                href={paths.auth.firebase.signUp}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={{
          container: { maxWidth: 'xl' },
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
        py: 8,
        bgcolor: 'grey.900',
        color: 'common.white',
      }}
    >
      <Container maxWidth="xl">
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
            <Logo sx={{ mb: 3 }} />
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
              <Link component={RouterLink} href={paths.faqs} color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                FAQs
              </Link>
              <Link component={RouterLink} href={paths.contact} color="grey.400" underline="hover" sx={{ typography: 'body2' }}>
                Contact Us
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
        footerSection={renderFooter()}
        cssVars={cssVars}
        sx={sx}
      >
        {renderMain()}
      </LayoutSection>
    </>
  );
}
