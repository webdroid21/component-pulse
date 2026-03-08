'use client';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCategories } from 'src/hooks/firebase';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function HomeCategories() {
  const { categories, loading } = useCategories();

  const activeCategories = categories.filter((cat) => cat.isActive);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Typography
          variant="h3"
          sx={{
            mb: { xs: 5, md: 8 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          Categories
        </Typography>

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(6, 1fr)',
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <Paper
                key={i}
                variant="outlined"
                sx={{
                  px: 1,
                  py: 3,
                  minWidth: 0,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'transparent',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  aspectRatio: '1/1',
                }}
              >
                <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={80} />
              </Paper>
            ))
            : activeCategories.map((category) => {
              const href = `${paths.products}?category=${category.slug}`;
              const color = category.color || 'primary.main';
              const icon = category.icon || 'solar:box-bold-duotone';
              const hasImage = !!category.image;

              return (
                <Paper
                  component={RouterLink}
                  href={href}
                  key={category.id}
                  variant="outlined"
                  sx={(theme) => ({
                    position: 'relative',
                    minWidth: 0,
                    borderRadius: 2,
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: hasImage ? 'common.white' : 'text.primary',
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    p: 2,
                    transition: theme.transitions.create(['all']),
                    '&:hover': {
                      boxShadow: theme.customShadows.z20,
                      transform: 'translateY(-4px)',
                    },
                    ...(hasImage && {
                      border: 'none',
                    })
                  })}
                >
                  {hasImage && (
                    <Image
                      alt={category.name}
                      src={category.image}
                      sx={(theme) => ({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 1,
                        height: 1,
                        zIndex: 0,
                      })}
                      slotProps={{
                        overlay: {
                          sx: (theme) => ({
                            bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.6),
                            transition: theme.transitions.create(['background-color']),
                            '&:hover': {
                              bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.4),
                            }
                          }),
                        },
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 1,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: hasImage ? varAlpha('#ffffff', 0.2) : `${color}20`,
                        color: hasImage ? 'common.white' : (typeof color === 'string' && color.includes('.') ? color : undefined),
                        backdropFilter: hasImage ? 'blur(4px)' : 'none',
                      }}
                    >
                      <Iconify
                        icon={icon}
                        width={40}
                        sx={{
                          color: (!hasImage && typeof color === 'string' && !color.includes('.')) ? color : undefined,
                        }}
                      />
                    </Box>

                    <Typography variant="subtitle2" noWrap sx={{ width: 1, textAlign: 'center' }}>
                      {category.name}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
}
