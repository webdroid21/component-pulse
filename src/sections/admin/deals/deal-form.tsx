'use client';

import type { DealItem } from 'src/hooks/firebase';

import { z as zod } from 'zod';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useStorage, useProducts, useDealMutations, useTrainingModules } from 'src/hooks/firebase';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewDealSchemaType = zod.infer<typeof NewDealSchema>;

export const NewDealSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  content: zod.string().min(1, { message: 'Content is required!' }),
  price: zod.number().min(0, { message: 'Price must be greater than or equal to 0!' }),
  originalPrice: zod.number().min(0, { message: 'Original Price must be greater than or equal to 0!' }),
  productIds: zod.array(zod.string()).min(0),
  trainingModuleIds: zod.array(zod.string()).min(0),
  isActive: zod.boolean(),
  coverImage: schemaHelper.file({ message: { required_error: 'Cover image is required!' } }),
});

// ----------------------------------------------------------------------

type Props = {
  currentDeal?: DealItem;
};

export function DealForm({ currentDeal }: Props) {
  const router = useRouter();
  const { createDeal, updateDeal } = useDealMutations();
  const { uploadFile } = useStorage();

  const { products } = useProducts();
  const { modules } = useTrainingModules();

  const productOptions = products.map((p) => ({ label: p.name, value: p.id }));
  const moduleOptions = modules.map((m) => ({ label: m.title, value: m.id }));

  const defaultValues = useMemo(
    () => ({
      name: currentDeal?.name || '',
      description: currentDeal?.description || '',
      content: currentDeal?.content || '',
      price: currentDeal?.price || 0,
      originalPrice: currentDeal?.originalPrice || 0,
      productIds: currentDeal?.productIds || [],
      trainingModuleIds: currentDeal?.trainingModuleIds || [],
      isActive: currentDeal?.isActive ?? true,
      coverImage: currentDeal?.coverImage || null,
    }),
    [currentDeal]
  );

  const methods = useForm<NewDealSchemaType>({
    resolver: zodResolver(NewDealSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      let coverImage = data.coverImage as string;

      if (data.coverImage && typeof data.coverImage !== 'string') {
        const url = await uploadFile(data.coverImage as File, `deals/${Date.now()}_cover`);
        if (url) {
          coverImage = url;
        }
      }

      const payload = {
        name: data.name,
        description: data.description,
        content: data.content,
        price: data.price,
        originalPrice: data.originalPrice,
        productIds: data.productIds,
        trainingModuleIds: data.trainingModuleIds,
        isActive: data.isActive,
        coverImage,
      };

      if (currentDeal) {
        await updateDeal(currentDeal.id, payload);
        toast.success('Deal updated successfully');
      } else {
        await createDeal(payload);
        toast.success('Deal created successfully');
      }

      router.push(paths.admin.deals.root);
    } catch (error) {
      console.error(error);
      toast.error(currentDeal ? 'Update failed!' : 'Create failed!');
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverImage', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('coverImage', null);
  }, [setValue]);

  const calculateOriginalPrice = useCallback(() => {
    let total = 0;
    values.productIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) total += product.price;
    });
    values.trainingModuleIds.forEach((id) => {
      const module = modules.find((m) => m.id === id);
      if (module) total += module.price;
    });
    setValue('originalPrice', total, { shouldValidate: true });
  }, [values.productIds, values.trainingModuleIds, products, modules, setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="name" label="Deal Name" />

              <Field.Text name="description" label="Short Description" multiline rows={3} />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Content (Details)</Typography>
                <Field.Editor name="content" sx={{ maxHeight: 480 }} />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Typography variant="subtitle2">Cover Image</Typography>
                <Field.Upload
                  name="coverImage"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Typography variant="subtitle2">Pricing</Typography>

                <Field.Text
                  name="price"
                  label="Combo Price"
                  placeholder="0.00"
                  type="number"
                />

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Field.Text
                    name="originalPrice"
                    label="Original Value"
                    placeholder="0.00"
                    type="number"
                  />
                  <LoadingButton
                    variant="outlined"
                    onClick={calculateOriginalPrice}
                    sx={{ height: 56, flexShrink: 0 }}
                  >
                    Auto-calc
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Typography variant="subtitle2">Items in Deal</Typography>

                <Field.Autocomplete
                  name="productIds"
                  label="Select Products"
                  placeholder="+ Products"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={productOptions.map(o => o.value)}
                  getOptionLabel={(option) => productOptions.find((o) => o.value === option)?.label || option}
                />

                <Field.Autocomplete
                  name="trainingModuleIds"
                  label="Select Training Modules"
                  placeholder="+ Modules"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={moduleOptions.map(o => o.value)}
                  getOptionLabel={(option) => moduleOptions.find((o) => o.value === option)?.label || option}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="isActive"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Active"
                    />
                  )}
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {currentDeal ? 'Save Changes' : 'Create Deal'}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
