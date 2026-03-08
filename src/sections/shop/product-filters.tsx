'use client';

import type { BoxProps } from '@mui/material/Box';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';

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
  categories: { id: string; name: string; slug?: string }[];
};

export function ProductFilters({
  open,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  categories,
}: Props) {

  // Accept both slug and id for matching to sync perfectly with URL
  const isCategorySelected = (category: { id: string; slug?: string }) => {
      return filters.categories.includes(category.id) || (category.slug && filters.categories.includes(category.slug));
  };

  const handleCategoryChange = (category: { id: string; slug?: string }) => {
    // Prefer slug if available for cleaner URLs, fallback to ID
    const identifier = category.slug || category.id;

    // Check if the current category is already selected
    const isSelected = isCategorySelected(category);

    // If it's already selected, we want to remove both its ID and its slug from the array just in case
    let newCategories = [...filters.categories];

    if (isSelected) {
        newCategories = newCategories.filter(c => c !== category.id && c !== category.slug);
    } else {
        newCategories.push(identifier);
    }

    onFilterChange('categories', newCategories);
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    onFilterChange('priceRange', newValue as number[]);
  };

  const renderContent = (
    <>
      <Block title="Category">
        <Box gap={1} display="flex" flexDirection="column" sx={{ pt: 1.5 }}>
          {categories.map((category) => (
            <Box
              key={category.id}
              gap={1}
              display="flex"
              alignItems="center"
              onClick={() => handleCategoryChange(category)}
              sx={{
                cursor: 'pointer',
                typography: 'body2',
                ...(isCategorySelected(category) && {
                  fontWeight: 'fontWeightBold',
                  color: 'primary.main'
                }),
              }}
            >
              <Iconify width={14} icon="solar:alt-arrow-right-outline" sx={{ ml: -0.25 }} />
              {category.name}
            </Box>
          ))}
        </Box>
      </Block>

      <Block title="Price">
        <Box sx={{ pt: 2, px: 2 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={1000000}
            step={5000}
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
      </Block>

      <FormControlLabel
        control={
          <Switch
            checked={filters.inStock}
            onChange={(e) => onFilterChange('inStock', e.target.checked)}
            inputProps={{ id: 'in-stock-switch' }}
          />
        }
        label="Only in stock"
        sx={{
          [`& .${formControlLabelClasses.label}`]: { typography: 'subtitle1' },
          px: 1,
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={filters.onSale}
            onChange={(e) => onFilterChange('onSale', e.target.checked)}
            inputProps={{ id: 'on-sale-switch' }}
          />
        }
        label="On sale"
        sx={{
          [`& .${formControlLabelClasses.label}`]: { typography: 'subtitle1' },
          px: 1,
        }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        variant="outlined"
        startIcon={<Iconify icon="solar:trash-bin-minimalistic-outline" />}
        onClick={onResetFilters}
        sx={{ mt: 3 }}
      >
        Clear all
      </Button>
    </>
  );

  const renderDesktop = (
    <Stack spacing={3} sx={{ width: 280, flexShrink: 0, display: { xs: 'none', md: 'flex' } }}>
      {renderContent}
    </Stack>
  );

  const renderMobile = (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { p: 3, gap: 2.5, width: 280, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>
      {renderContent}
    </Drawer>
  );

  return (
    <>
      {renderDesktop}
      {renderMobile}
    </>
  );
}

// ----------------------------------------------------------------------

type BlockProps = BoxProps & {
  title: string;
};

function Block({ title, children, sx, ...other }: BlockProps) {
  const contentOpen = useBoolean(true);

  return (
    <Box display="flex" flexDirection="column" sx={sx} {...other}>
      <Box
        display="flex"
        alignItems="center"
        onClick={contentOpen.onToggle}
        sx={{ width: 1, cursor: 'pointer' }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <Iconify width={16} icon={contentOpen.value ? 'eva:minus-outline' : 'eva:plus-outline'} />
      </Box>

      <Collapse unmountOnExit in={contentOpen.value} sx={{ px: 0.25 }}>
        {children}
      </Collapse>
    </Box>
  );
}
