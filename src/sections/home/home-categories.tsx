'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCategories } from 'src/hooks/firebase';

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

              return (
                <Paper
                  component={RouterLink}
                  href={href}
                  key={category.id}
                  variant="outlined"
                  sx={{
                    px: 1,
                    py: 3,
                    minWidth: 0,
                    borderRadius: 2,
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: `${color}20`,
                      color: typeof color === 'string' && color.includes('.') ? color : undefined,
                    }}
                  >
                    <Iconify
                      icon={icon}
                      width={40}
                      sx={{
                        color: typeof color === 'string' && !color.includes('.') ? color : undefined,
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle2" noWrap sx={{ width: 1, textAlign: 'center' }}>
                    {category.name}
                  </Typography>
                </Paper>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
}
