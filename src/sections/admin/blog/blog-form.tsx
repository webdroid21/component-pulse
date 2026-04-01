'use client';

import type { PostItem } from 'src/hooks/firebase';

import { z as zod } from 'zod';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useStorageUpload, usePostMutations } from 'src/hooks/firebase';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewBlogSchemaType = zod.infer<typeof NewBlogSchema>;

export const NewBlogSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  content: zod.string().min(1, { message: 'Content is required!' }),
  tags: zod.array(zod.string()).min(1, { message: 'Must have at least 1 tag' }),
  metaKeywords: zod.array(zod.string()),
  metaTitle: zod.string(),
  metaDescription: zod.string(),
  publish: zod.boolean(),
  enableComments: zod.boolean(),
  coverUrl: schemaUtils.file(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: PostItem;
};

export function BlogForm({ currentPost }: Props) {
  const router = useRouter();
  const { createPost, updatePost } = usePostMutations();
  const { uploadFile } = useStorageUpload('blog');

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      tags: currentPost?.tags || [],
      metaKeywords: currentPost?.metaKeywords || [],
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
      publish: currentPost?.publish ?? true,
      enableComments: currentPost?.enableComments ?? true,
      coverUrl: currentPost?.coverUrl || null,
    }),
    [currentPost]
  );

  const methods = useForm<NewBlogSchemaType>({
    resolver: zodResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      let coverUrl = data.coverUrl as string;

      if (data.coverUrl && typeof data.coverUrl !== 'string') {
        const uploadedFile = await uploadFile(data.coverUrl as File);
        if (uploadedFile) {
          coverUrl = uploadedFile.url;
        }
      }

      const payload = {
        title: data.title,
        description: data.description,
        content: data.content,
        tags: data.tags,
        metaKeywords: data.metaKeywords,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        publish: data.publish,
        enableComments: data.enableComments,
        coverUrl,
      };

      if (currentPost) {
        await updatePost(currentPost.id, payload);
        toast.success('Post updated successfully');
      } else {
        await createPost(payload);
        toast.success('Post created successfully');
      }

      router.push(paths.admin.blog.root);
    } catch (error) {
      console.error(error);
      toast.error(currentPost ? 'Update failed!' : 'Create failed!');
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 3 }}>
                Details
              </Typography>
              <Stack spacing={3}>
                <Field.Text name="title" label="Post Title" />
                <Field.Text name="description" label="Short Description" multiline rows={3} />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Content</Typography>
                  <Field.Editor name="content" sx={{ maxHeight: 600 }} />
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 3 }}>
                Properties
              </Typography>
              <Stack spacing={3}>
                <Field.Autocomplete
                  name="tags"
                  label="Tags"
                  placeholder="+ Tags"
                  multiple
                  freeSolo
                  options={[]}
                  getOptionLabel={(option) => option}
                />
                <Field.Text name="metaTitle" label="Meta Title" />
                <Field.Text name="metaDescription" label="Meta Description" multiline rows={3} />
                <Field.Autocomplete
                  name="metaKeywords"
                  label="Meta Keywords"
                  placeholder="+ Keywords"
                  multiple
                  freeSolo
                  options={[]}
                  getOptionLabel={(option) => option}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 3 }}>
                Cover Image
              </Typography>
              <Field.Upload
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Controller
                  name="enableComments"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable comments"
                    />
                  )}
                />

                <Controller
                  name="publish"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} color="primary" />}
                      label="Publish"
                    />
                  )}
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {currentPost ? 'Save Changes' : 'Create Post'}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
