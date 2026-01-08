'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  filters: {
    categories: string[];
    priceRange: number[];
    inStock: boolean;
    onSale: boolean;
  };
  onFilterChange: (name: string, value: any) => void;
  onResetFilters: () => void;
  categories: { id: string; name: string }[];
};

export function ProductFilters({
  open,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  categories,
}: Props) {
  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange('categories', newCategories);
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    onFilterChange('priceRange', newValue as number[]);
  };

  const renderCategories = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Stack spacing={1}>
        {categories.map((category) => (
          <FormControlLabel
            key={category.id}
            control={
              <Checkbox
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
            }
            label={category.name}
          />
        ))}
      </Stack>
    </Box>
  );

  const renderPrice = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          min={0}
          max={10000000}
          step={50000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => fCurrency(value)}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fCurrency(filters.priceRange[0])}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fCurrency(filters.priceRange[1])}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );

  const renderOptions = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Options
      </Typography>
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.inStock}
              onChange={(e) => onFilterChange('inStock', e.target.checked)}
            />
          }
          label="In Stock Only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onSale}
              onChange={(e) => onFilterChange('onSale', e.target.checked)}
            />
          }
          label="On Sale"
        />
      </Stack>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 320 } } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Divider />

      <Stack spacing={3} sx={{ p: 2.5, flexGrow: 1, overflow: 'auto' }}>
        {renderCategories()}
        <Divider />
        {renderPrice()}
        <Divider />
        {renderOptions()}
      </Stack>

      <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <Button fullWidth variant="outlined" onClick={onResetFilters}>
            Clear All
          </Button>
          <Button fullWidth variant="contained" onClick={onClose}>
            Apply
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
