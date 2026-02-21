# MUI Grid v7 Migration Guide

## Overview

Material-UI v7 introduced **Grid2** as the default Grid component with significant API changes. The old Grid API has been deprecated, and the new stable Grid2 system replaces it entirely.

## Key Changes

### 1. **`item` Prop Removed → Use `size` Prop**

The `item` boolean prop has been removed. Instead, use the `size` prop to define grid item sizing.

#### ❌ Old API (v6 and earlier)
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <TextField />
  </Grid>
  <Grid item xs={12} md={4}>
    <TextField />
  </Grid>
</Grid>
```

#### ✅ New API (v7+)
```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
    <TextField />
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <TextField />
  </Grid>
</Grid>
```

### 2. **Single Breakpoint Sizing**

For items that span all columns at all breakpoints:

#### ❌ Old API
```tsx
<Grid item xs={12}>
  <TextField fullWidth />
</Grid>
```

#### ✅ New API
```tsx
<Grid size={12}>
  <TextField fullWidth />
</Grid>
```

### 3. **Responsive Sizing Object**

The `size` prop accepts an object for responsive sizing:

```tsx
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
  <Card />
</Grid>
```

### 4. **Container Prop Still Works**

The `container` prop remains unchanged:

```tsx
<Grid container spacing={2}>
  {/* Grid items */}
</Grid>
```

---

## Benefits of Grid2 (v7)

### 1. **CSS Grid Native Support**
- Uses CSS Grid Layout instead of Flexbox
- Better performance and more powerful layout options
- Native gap support

### 2. **Improved API**
- Cleaner, more intuitive API
- Reduced prop confusion (no more `item` boolean)
- Better TypeScript support

### 3. **Offset Support**
```tsx
<Grid size={{ xs: 8 }} offset={{ xs: 2 }}>
  <Card /> {/* Centered with 2-column offset */}
</Grid>
```

### 4. **Variable Columns**
```tsx
<Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
  <Grid size={{ xs: 2, sm: 4, md: 6 }}>
    <Card />
  </Grid>
</Grid>
```

---

## Migration Checklist

- [x] **Export `axiosInstance` as named export** in `axios.ts`
- [x] **Update all Grid components** in beneficiaries module:
  - [x] `beneficiaries-filters.tsx` (18 Grid items)
  - [x] `edit-location-dialog.tsx` (5 Grid items)
  - [x] `edit-personal-info-dialog.tsx` (11 Grid items)
  - [x] `create-beneficiary-view.tsx` (28 Grid items)
  - [x] `beneficiary-details-view.tsx` (15 Grid items)

---

## Files Updated

### 1. **`axios.ts`**
```typescript
// Before
export default axiosInstance;

// After
export default axiosInstance;
export { axiosInstance }; // Added named export
```

### 2. **Beneficiaries Components**
All Grid components updated from:
- `<Grid item xs={12} md={6}>` → `<Grid size={{ xs: 12, md: 6 }}>`
- `<Grid item xs={12}>` → `<Grid size={12}>`
- `<Grid item xs={12} md={4}>` → `<Grid size={{ xs: 12, md: 4 }}>`

**Total Grid Items Updated:** 77

---

## Common Patterns

### Full-Width Item
```tsx
<Grid size={12}>
  <Button fullWidth />
</Grid>
```

### Half-Width on Desktop, Full on Mobile
```tsx
<Grid size={{ xs: 12, md: 6 }}>
  <TextField />
</Grid>
```

### Three Columns on Desktop
```tsx
<Grid size={{ xs: 12, md: 4 }}>
  <Card />
</Grid>
```

### Custom Breakpoint Layout
```tsx
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
  <Box />
</Grid>
```

### Conditional Grid Item
```tsx
{showField && (
  <Grid size={12}>
    <TextField />
  </Grid>
)}
```

---

## Additional Resources

- [MUI Grid v7 Documentation](https://mui.com/material-ui/react-grid2/)
- [Migration Guide from v6 to v7](https://mui.com/material-ui/migration/migration-grid-v2/)
- [CSS Grid vs Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

---

## Breaking Changes Summary

| Old API (v6) | New API (v7) | Notes |
|--------------|--------------|-------|
| `<Grid item xs={12}>` | `<Grid size={12}>` | Single value |
| `<Grid item xs={12} md={6}>` | `<Grid size={{ xs: 12, md: 6 }}>` | Responsive object |
| `<Grid item>` | `<Grid size="auto">` | Auto-sizing |
| `spacing={2}` | `spacing={2}` | Unchanged |
| `container` | `container` | Unchanged |

---

## Testing

After migration, verify:
- ✅ All layouts render correctly at different breakpoints
- ✅ Spacing between items is preserved
- ✅ Responsive behavior works as expected
- ✅ No TypeScript errors
- ✅ No console warnings about deprecated props

---

## Migration Date

**December 7, 2024**

**MUI Version:** v7.3.1

**Status:** ✅ Complete
