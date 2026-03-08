import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { PostItem as IPostItem } from 'src/hooks/firebase';

import { format } from 'date-fns';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

import { fShortenNumber } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type PostItemProps = CardProps & {
  post: IPostItem;
  detailsHref: string;
};

export function PostItem({ post, detailsHref, sx, ...other }: PostItemProps) {
  return (
    <Card sx={sx} {...other}>
      <Box sx={{ position: 'relative' }}>
        <Image alt={post.title} src={post.coverUrl || '/assets/placeholder.svg'} ratio="4/3" />
      </Box>

      <CardContent sx={{ pt: 3 }}>
        <Typography variant="caption" component="div" sx={{ mb: 1, color: 'text.disabled' }}>
          {post.createdAt ? format(post.createdAt.toDate(), 'dd MMM yyyy') : 'Recently'}
        </Typography>

        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant="subtitle2"
          sx={(theme) => ({
            ...theme.mixins.maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          })}
        >
          {post.title}
        </Link>
        <Typography variant="body2" sx={(theme) => ({
             color: 'text.secondary',
             mt: 1,
            ...theme.mixins.maxLine({ line: 2 }),
        })}>
            {post.description}
        </Typography>

        <InfoBlock
          totalViews={0}
          totalShares={0}
          totalComments={0}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostItemLatestProps = {
  post: IPostItem;
  index: number;
  detailsHref: string;
};

export function PostItemLatest({ post, index, detailsHref }: PostItemLatestProps) {
  const postSmall = index === 1 || index === 2;

  return (
    <Card>
      <Image
        alt={post.title}
        src={post.coverUrl || '/assets/placeholder.svg'}
        ratio="4/3"
        sx={{ height: 360 }}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
            }),
          },
        }}
      />

      <CardContent
        sx={{
          width: 1,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
           {post.createdAt ? format(post.createdAt.toDate(), 'dd MMM yyyy') : 'Recently'}
        </Typography>

        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant={postSmall ? 'subtitle2' : 'h5'}
          sx={(theme) => ({
            ...theme.mixins.maxLine({
              line: 2,
              persistent: postSmall ? theme.typography.subtitle2 : theme.typography.h5,
            }),
          })}
        >
          {post.title}
        </Link>

        <InfoBlock
          totalViews={0}
          totalShares={0}
          totalComments={0}
          sx={{ opacity: 0.64, color: 'common.white' }}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type InfoBlockProps = BoxProps & { totalViews?: number; totalShares?: number; totalComments?: number };

function InfoBlock({ sx, totalViews, totalShares, totalComments, ...other }: InfoBlockProps) {
  return (
    <Box
      sx={[
        () => ({
          mt: 3,
          gap: 1.5,
          display: 'flex',
          typography: 'caption',
          color: 'text.disabled',
          justifyContent: 'flex-end',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:chat-round-dots-bold" />
        {fShortenNumber(totalComments || 0)}
      </Box>

      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:eye-bold" />
        {fShortenNumber(totalViews || 0)}
      </Box>

      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:share-bold" />
        {fShortenNumber(totalShares || 0)}
      </Box>
    </Box>
  );
}
