'use client';

import type { Product, ProductImage, ProductFormData } from 'src/types/product';

import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCategories, useProductMutations, useProductImageUpload } from 'src/hooks/firebase';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type ProductFormValues = {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  categoryId: string;
  brand: string;
  weight: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
};

type Props = {
  currentProduct?: Product;
};

// ----------------------------------------------------------------------

export function ProductCreateEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);
  const openPricing = useBoolean(true);

  const { categories, loading: categoriesLoading } = useCategories();
  const { createProduct, updateProduct, loading: saving } = useProductMutations();
  const { uploadMultiple, deleteFile, loading: uploading, progress } = useProductImageUpload();

  const [images, setImages] = useState<(File | ProductImage)[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [tagInput, setTagInput] = useState('');

  const defaultValues: ProductFormValues = {
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: 0,
    compareAtPrice: 0,
    costPrice: 0,
    stock: 0,
    lowStockThreshold: 5,
    categoryId: '',
    brand: '',
    weight: 0,
    weightUnit: 'kg',
    tags: [],
    isActive: true,
    isFeatured: false,
  };

  const methods = useForm<ProductFormValues>({
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Load existing product data
  useEffect(() => {
    if (currentProduct) {
      reset({
        name: currentProduct.name,
        description: currentProduct.description,
        shortDescription: currentProduct.shortDescription || '',
        sku: currentProduct.sku,
        price: currentProduct.price,
        compareAtPrice: currentProduct.compareAtPrice || 0,
        costPrice: currentProduct.costPrice || 0,
        stock: currentProduct.stock,
        lowStockThreshold: currentProduct.lowStockThreshold || 5,
        categoryId: currentProduct.categoryId,
        brand: currentProduct.brand || '',
        weight: currentProduct.weight || 0,
        weightUnit: currentProduct.weightUnit || 'kg',
        tags: currentProduct.tags || [],
        isActive: currentProduct.isActive,
        isFeatured: currentProduct.isFeatured,
      });
      setImages(currentProduct.images || []);
      // Find featured image index
      const featuredIdx = currentProduct.images?.findIndex((img) => img.isFeatured) ?? 0;
      setFeaturedImageIndex(featuredIdx >= 0 ? featuredIdx : 0);
    }
  }, [currentProduct, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Upload new images
      const newFiles = images.filter((img): img is File => img instanceof File);
      const existingImages = images.filter((img): img is ProductImage => !(img instanceof File));

      let uploadedImages: ProductImage[] = [...existingImages];

      if (newFiles.length > 0) {
        const uploaded = await uploadMultiple(newFiles, currentProduct?.id || 'new');
        const newProductImages: ProductImage[] = uploaded.map((file, idx) => ({
          id: `img-${Date.now()}-${idx}`,
          url: file.url,
          alt: data.name,
          isFeatured: false,
        }));
        uploadedImages = [...uploadedImages, ...newProductImages];
      }

      // Set featured image
      uploadedImages = uploadedImages.map((img, idx) => ({
        ...img,
        isFeatured: idx === featuredImageIndex,
      }));

      const category = categories.find((c) => c.id === data.categoryId);

      // Build product data, excluding undefined values to avoid Firestore errors
      const productData: Partial<ProductFormData> = {
        name: data.name,
        description: data.description || '',
        sku: data.sku,
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        categoryId: data.categoryId || '',
        tags: data.tags || [],
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: uploadedImages,
        weightUnit: data.weightUnit,
      };

      // Add optional fields only if they have values
      if (data.shortDescription) productData.shortDescription = data.shortDescription;
      if (data.compareAtPrice) productData.compareAtPrice = Number(data.compareAtPrice);
      if (data.costPrice) productData.costPrice = Number(data.costPrice);
      if (data.lowStockThreshold) productData.lowStockThreshold = Number(data.lowStockThreshold);
      if (category?.name) productData.categoryName = category.name;
      if (data.brand) productData.brand = data.brand;
      if (data.weight) productData.weight = Number(data.weight);

      let success = false;
      if (currentProduct) {
        success = await updateProduct(currentProduct.id, productData);
      } else {
        const productId = await createProduct(productData);
        success = !!productId;
      }

      if (success) {
        toast.success(currentProduct ? 'Product updated!' : 'Product created!');
        router.push(paths.admin.products.root);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  });

  const handleDropImages = useCallback(
    (acceptedFiles: File[]) => {
      setImages((prev) => [...prev, ...acceptedFiles]);
    },
    []
  );

  const handleRemoveImage = useCallback(
    async (index: number) => {
      const imageToRemove = images[index];

      // If it's an existing image with a path, delete from storage
      if (!(imageToRemove instanceof File) && imageToRemove.url) {
        // Extract path from URL if needed - for now just remove from state
      }

      setImages((prev) => prev.filter((_, i) => i !== index));

      // Adjust featured index if needed
      if (featuredImageIndex === index) {
        setFeaturedImageIndex(0);
      } else if (featuredImageIndex > index) {
        setFeaturedImageIndex((prev) => prev - 1);
      }
    },
    [images, featuredImageIndex]
  );

  const handleRemoveAllImages = useCallback(() => {
    setImages([]);
    setFeaturedImageIndex(0);
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      setValue('tags', [...values.tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, values.tags, setValue]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setValue(
        'tags',
        values.tags.filter((tag) => tag !== tagToRemove)
      );
    },
    [values.tags, setValue]
  );

  const renderCollapseButton = (value: boolean, onToggle: () => void) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, description, images..."
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="name" label="Product name" />

          <Field.Text name="shortDescription" label="Short description" multiline rows={2} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Description (Markdown supported)</Typography>
            <Field.Editor name="description" sx={{ maxHeight: 480 }} />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <Field.Upload
              multiple
              name="productImages"
              maxSize={5242880}
              accept={{ 'image/*': [] }}
              onDrop={handleDropImages}
              onRemove={(file) => {
                const index = images.findIndex((img) =>
                  img instanceof File ? img === file : img.url === file
                );
                if (index >= 0) handleRemoveImage(index);
              }}
              onRemoveAll={handleRemoveAllImages}
            />

            {images.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  Click to set featured image:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {images.map((img, index) => {
                    const url = img instanceof File ? URL.createObjectURL(img) : img.url;
                    const isFeatured = index === featuredImageIndex;
                    return (
                      <Box
                        key={index}
                        onClick={() => setFeaturedImageIndex(index)}
                        sx={{
                          position: 'relative',
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: isFeatured ? '3px solid' : '1px solid',
                          borderColor: isFeatured ? 'primary.main' : 'divider',
                        }}
                      >
                        <Box
                          component="img"
                          src={url}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isFeatured && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              fontSize: 10,
                              textAlign: 'center',
                              py: 0.25,
                            }}
                          >
                            Featured
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        subheader="SKU, category, tags..."
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text name="sku" label="SKU" />
            <Field.Text name="brand" label="Brand" />

            <Field.Text
              name="stock"
              label="Stock quantity"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Select
              name="categoryId"
              label="Category"
              disabled={categoriesLoading}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Field.Text
                name="tagInput"
                label="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {values.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text
              name="weight"
              label="Weight"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Field.Select name="weightUnit" label="Weight unit">
              <MenuItem value="kg">Kilograms (kg)</MenuItem>
              <MenuItem value="g">Grams (g)</MenuItem>
              <MenuItem value="lb">Pounds (lb)</MenuItem>
              <MenuItem value="oz">Ounces (oz)</MenuItem>
            </Field.Select>
          </Box>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <CardHeader
        title="Pricing"
        subheader="Price, sale price, cost..."
        action={renderCollapseButton(openPricing.value, openPricing.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openPricing.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text
            name="price"
            label="Price"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      UGX
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="compareAtPrice"
            label="Compare at price (original)"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      UGX
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="costPrice"
            label="Cost price"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      UGX
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="lowStockThreshold"
            label="Low stock alert threshold"
            type="number"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(e) => setValue('isActive', e.target.checked)}
            />
          }
          label="Active"
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.isFeatured}
              onChange={(e) => setValue('isFeatured', e.target.checked)}
            />
          }
          label="Featured"
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting || saving || uploading}
        startIcon={
          (isSubmitting || saving || uploading) && (
            <CircularProgress size={20} color="inherit" />
          )
        }
      >
        {uploading
          ? `Uploading ${progress}%`
          : currentProduct
            ? 'Save changes'
            : 'Create product'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderPricing()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
