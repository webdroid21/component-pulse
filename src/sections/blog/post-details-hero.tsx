import type { BoxProps } from '@mui/material/Box';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  coverUrl: string;
  createdAt: Date;
} & BoxProps;

const _socials = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'Linkedin' },
];

export function PostDetailsHero({ sx, title, coverUrl, createdAt, ...other }: Props) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.64)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.64)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: 480,
          overflow: 'hidden',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container sx={{ height: 1, position: 'relative' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            maxWidth: 680,
            position: 'absolute',
            pt: { xs: 4, md: 10 },
            color: 'common.white',
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: 'absolute',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, md: 3 },
              pb: { xs: 3, md: 8 },
            }}
          >
            <Avatar alt="ComponentPulse" sx={{ width: 64, height: 64, mr: 2 }} />

            <ListItemText
              sx={{ color: 'common.white' }}
              primary="ComponentPulse Editor"
              secondary={fDate(createdAt)}
              slotProps={{
                primary: { sx: { typography: 'subtitle1' } },
                secondary: { sx: { mt: 0.5, opacity: 0.64, color: 'inherit' } },
              }}
            />
          </Box>

          <SpeedDial
            direction={smUp ? 'left' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium' }}
            sx={{ position: 'absolute', bottom: { xs: 32, md: 64 }, right: { xs: 16, md: 24 } }}
          >
            {_socials.map((social) => (
              <SpeedDialAction
                key={social.label}
                icon={
                  <>
                    {social.value === 'twitter' && <Iconify icon="eva:twitter-fill" />}
                    {social.value === 'facebook' && <Iconify icon="eva:facebook-fill" />}
                    {social.value === 'linkedin' && <Iconify icon="eva:linkedin-fill" />}
                  </>
                }
                slotProps={{
                  fab: { color: 'default' },
                  tooltip: {
                    placement: 'top',
                    title: social.label,
                  },
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      </Container>
    </Box>
  );
}
