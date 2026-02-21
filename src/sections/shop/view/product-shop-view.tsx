'use client';

import { m } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useProducts, useCategories } from 'src/hooks/firebase';

import { Iconify } from 'src/components/iconify';

import { ProductItem } from '../product-item';
import { ProductFilters } from '../product-filters';
import { ProductListItem } from '../product-list-item';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'newest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const VIEW_OPTIONS = [
  { value: 'list', icon: <Iconify icon="carbon:list-boxes" /> },
  { value: 'grid', icon: <Iconify icon="carbon:grid" /> },
];

const PRODUCTS_PER_PAGE = 12;

export function ProductShopView() {
  const { products, loading } = useProducts({ isActive: true });
  const { categories } = useCategories();

  const filtersOpen = useBoolean();

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  // Sync with URL query param if it changes
  useMemo(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearch(q);
      setPage(1);
    }
  }, [searchParams]);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 10000000],
    inStock: false,
    onSale: false,
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 10000000],
      inStock: false,
      onSale: false,
    });
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.categoryId));
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.quantity > 0);
    }

    // On sale filter
    if (filters.onSale) {
      result = result.filter((p) => p.salePrice && p.salePrice < p.price);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // newest - sort by createdAt if available
        break;
    }

    return result;
  }, [products, search, filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const activeFiltersCount =
    filters.categories.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000 ? 1 : 0);

  const renderList = (
    <>
      {viewMode === 'grid' ? (
        <Box
          rowGap={4}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <Skeleton variant="rectangular" height={220} />
                <CardContent>
                  <Skeleton variant="text" width="40%" height={16} />
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="50%" height={28} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))
            : paginatedProducts.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductItem product={product} />
              </m.div>
            ))}
        </Box>
      ) : (
        <Stack spacing={4}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                <Skeleton variant="rectangular" width={160} height={160} sx={{ borderRadius: 1.5, mr: 2.5 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="80%" height={32} sx={{ my: 1 }} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
                </Box>
              </Card>
            ))
            : paginatedProducts.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductListItem product={product} />
              </m.div>
            ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          size="large"
          sx={{
            mt: 8,
            mb: 5,
            [`& .MuiPagination-ul`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );

  return (
    <Box sx={{ pb: { xs: 4, md: 6 }, pt: { xs: 1, md: 2 } }}>
      <Container>
        {/* Header */}
        <Box display="flex" alignItems="center" sx={{ pb: 5 }}>
          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify width={18} icon="solar:filter-outline" />}
            onClick={filtersOpen.onTrue}
            sx={{ display: { md: 'none' } }}
          >
            Filters
          </Button>
        </Box>

        <Stack direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 10 }}>
          <ProductFilters
            open={filtersOpen.value}
            onClose={filtersOpen.onFalse}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          />

          <Box
            flex="1 1 auto"
            sx={{
              minWidth: 0,
              pl: { md: 8 },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 5 }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={viewMode}
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setViewMode(newValue);
                  }
                }}
                sx={{ borderColor: 'transparent', flexShrink: 0 }}
              >
                {VIEW_OPTIONS.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <TextField
                fullWidth
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:magnifer-bold" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  flexGrow: 1,
                }}
              />

              <TextField
                select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 180, flexShrink: 0 }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {renderList}

            {/* Empty state */}
            {!loading && filteredProducts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Iconify icon="solar:box-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1 }}>
                  No products found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button variant="outlined" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
