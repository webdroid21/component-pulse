'use client';

import type { TrainingModule, TrainingModuleFormData, TrainingMaterial } from 'src/types/training-module';

import { useForm, useFieldArray } from 'react-hook-form';
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
import TextField from '@mui/material/TextField';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
    useTrainingModuleMutations,
    useTrainingImageUpload,
    useTrainingMaterialsUpload,
} from 'src/hooks/firebase/use-training-modules';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValues = {
    title: string;
    description: string;
    duration: string;
    topics: string[];
    content: string;
    price: number;
    discount: number;
    isFree: boolean;
    visibility: 'public' | 'logged_in';
    status: 'active' | 'draft' | 'coming_soon';
    timeline: { title: string; description: string; duration: string }[];
    coverImage: File | string | null;
    materials: (File | string)[];
};

type Props = {
    currentModule?: TrainingModule;
};

// ----------------------------------------------------------------------

export function TrainingModuleForm({ currentModule }: Props) {
    const router = useRouter();

    const openDetails = useBoolean(true);
    const openContent = useBoolean(true);
    const openTimeline = useBoolean(true);
    const openSettings = useBoolean(true);

    const { createModule, updateModule, loading: saving } = useTrainingModuleMutations();
    const { uploadCoverImage, loading: uploadingCover } = useTrainingImageUpload();
    const { uploadMaterials, loading: uploadingMats, progress: matsProgress } = useTrainingMaterialsUpload();

    const [coverFile, setCoverFile] = useState<File | string | null>(null);
    const [materialFiles, setMaterialFiles] = useState<(File | TrainingMaterial)[]>([]);
    const [tagInput, setTagInput] = useState('');

    const defaultValues: FormValues = {
        title: '',
        description: '',
        duration: '',
        topics: [],
        content: '',
        price: 0,
        discount: 0,
        isFree: false,
        visibility: 'public',
        status: 'draft',
        timeline: [{ title: '', description: '', duration: '' }],
        coverImage: null,
        materials: [],
    };

    const methods = useForm<FormValues>({ defaultValues });

    const {
        watch,
        reset,
        setValue,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
        control,
        name: 'timeline',
    });

    const values = watch();

    useEffect(() => {
        if (currentModule) {
            reset({
                title: currentModule.title,
                description: currentModule.description,
                duration: currentModule.duration,
                topics: currentModule.topics || [],
                content: currentModule.content || '',
                price: currentModule.price || 0,
                discount: currentModule.discount || 0,
                isFree: currentModule.isFree,
                visibility: currentModule.visibility,
                status: currentModule.status,
                timeline: currentModule.timeline?.length
                    ? currentModule.timeline
                    : [{ title: '', description: '', duration: '' }],
                coverImage: currentModule.coverImage || null,
                materials: currentModule.materials?.map(m => m.url) || [],
            });
            setCoverFile(currentModule.coverImage || null);
            setMaterialFiles(currentModule.materials || []);
        }
    }, [currentModule, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const isNew = !currentModule;
            // We need an ID to upload files cleanly into a folder.
            // For a new module, we'll create the doc first with empty media, then upload, then update.
            let moduleId = currentModule?.id;

            let finalCoverImage = currentModule?.coverImage || '';
            let finalMaterials = currentModule?.materials || [];

            // 1. If new, create the draft document first
            if (isNew) {
                const id = await createModule({
                    ...data,
                    coverImage: '',
                    materials: [],
                });
                if (!id) throw new Error('Failed to create initial document');
                moduleId = id;
            }

            if (!moduleId) return;

            // 2. Upload Cover Image if it's a new File
            if (coverFile instanceof File) {
                finalCoverImage = await uploadCoverImage(coverFile, moduleId);
            }

            // 3. Upload Materials that are new Files
            const newMatFiles = materialFiles.filter((m): m is File => m instanceof File);
            const existingMats = materialFiles.filter((m): m is TrainingMaterial => !(m instanceof File));

            if (newMatFiles.length > 0) {
                const uploadedMats = await uploadMaterials(newMatFiles, moduleId);
                finalMaterials = [...existingMats, ...uploadedMats];
            } else {
                finalMaterials = existingMats;
            }

            // 4. Final update with all data and media
            const updateData: Partial<TrainingModuleFormData> = {
                ...data,
                price: Number(data.price),
                discount: Number(data.discount),
                coverImage: finalCoverImage,
                materials: finalMaterials,
            };

            // Sanitize: Firestore crashes if any value is exactly `undefined`
            Object.keys(updateData).forEach((key) => {
                if ((updateData as any)[key] === undefined) {
                    delete (updateData as any)[key];
                }
            });
            // Also explicitly remove tagInput if it accidentally leaked into RHF
            if ('tagInput' in updateData) {
                delete (updateData as any).tagInput;
            }

            const success = await updateModule(moduleId, updateData);

            if (success) {
                toast.success(isNew ? 'Module created!' : 'Module updated!');
                router.push(paths.admin.trainingModules.root);
            }
        } catch (error) {
            console.error('Error saving training module:', error);
            toast.error('Failed to save module');
        }
    });

    // Cover Image Handlers
    const handleDropCover = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                setCoverFile(file);
                setValue('coverImage', file, { shouldValidate: true });
            }
        },
        [setValue]
    );
    const handleRemoveCover = useCallback(() => {
        setCoverFile(null);
        setValue('coverImage', null, { shouldValidate: true });
    }, [setValue]);

    // Materials Handlers
    const handleDropMaterials = useCallback(
        (acceptedFiles: File[]) => {
            setMaterialFiles((prev) => [...prev, ...acceptedFiles]);
            setValue('materials', [...values.materials, ...acceptedFiles], { shouldValidate: true });
        },
        [setValue, values.materials]
    );
    const handleRemoveMaterial = useCallback((inputFile: File | string) => {
        setMaterialFiles((prev) =>
            prev.filter((file) => {
                if (file instanceof File && inputFile instanceof File) return file.name !== inputFile.name;
                if (!(file instanceof File) && typeof inputFile === 'string') return file.url !== inputFile;
                return true;
            })
        );
        setValue(
            'materials',
            values.materials.filter((file) => file !== inputFile),
            { shouldValidate: true }
        );
    }, [setValue, values.materials]);

    // Tag Handlers
    const handleAddTag = useCallback(() => {
        if (tagInput.trim() && !values.topics.includes(tagInput.trim())) {
            setValue('topics', [...values.topics, tagInput.trim()]);
            setTagInput('');
        }
    }, [tagInput, values.topics, setValue]);

    const handleRemoveTag = useCallback(
        (tagToRemove: string) => {
            setValue(
                'topics',
                values.topics.filter((tag) => tag !== tagToRemove)
            );
        },
        [values.topics, setValue]
    );

    const renderCollapseButton = (value: boolean, onToggle: () => void) => (
        <IconButton onClick={onToggle}>
            <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
        </IconButton>
    );

    const renderDetails = () => (
        <Card>
            <CardHeader
                title="Basic Details"
                action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
                sx={{ mb: 3 }}
            />
            <Collapse in={openDetails.value}>
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Field.Text name="title" label="Module Title" required />
                    <Field.Text name="description" label="Short Description" multiline rows={3} required />
                    <Field.Text name="duration" label="Estimated Duration (e.g., '2 hours', '4 weeks')" />

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Topics</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Add topic"
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
                            <Button variant="outlined" onClick={handleAddTag}>Add</Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {values.topics.map((tag) => (
                                <Chip key={tag} label={tag} size="small" onDelete={() => handleRemoveTag(tag)} />
                            ))}
                        </Box>
                    </Box>
                </Stack>
            </Collapse>
        </Card>
    );

    const renderContent = () => (
        <Card>
            <CardHeader
                title="Content & Materials"
                action={renderCollapseButton(openContent.value, openContent.onToggle)}
                sx={{ mb: 3 }}
            />
            <Collapse in={openContent.value}>
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">Cover Image</Typography>
                        <Field.Upload
                            name="coverImage"
                            maxSize={3145728}
                            accept={{ 'image/*': [] }}
                            onDrop={handleDropCover}
                            onDelete={handleRemoveCover}
                        />
                    </Stack>

                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">Rich Text Content</Typography>
                        <Field.Editor name="content" sx={{ maxHeight: 480 }} />
                    </Stack>

                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">Downloadable Materials</Typography>
                        <Field.Upload
                            multiple
                            name="materials"
                            maxSize={20971520} // 20MB
                            accept={{
                                'application/pdf': ['.pdf'],
                                'application/msword': ['.doc'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                'application/vnd.ms-excel': ['.xls'],
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                                'application/vnd.ms-powerpoint': ['.ppt'],
                                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                                'text/plain': ['.txt'],
                                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
                                'video/*': ['.mp4', '.webm', '.avi', '.mov'],
                                'application/zip': ['.zip', '.rar', '.7z'],
                                'application/x-zip-compressed': ['.zip'],
                            }}
                            onDrop={handleDropMaterials}
                            onRemove={(file) => handleRemoveMaterial(file)}
                            onRemoveAll={() => setMaterialFiles([])}
                        />
                    </Stack>
                </Stack>
            </Collapse>
        </Card>
    );

    const renderTimeline = () => (
        <Card>
            <CardHeader
                title="Timeline / Structure"
                action={renderCollapseButton(openTimeline.value, openTimeline.onToggle)}
                sx={{ mb: 3 }}
            />
            <Collapse in={openTimeline.value}>
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    {timelineFields.map((item, index) => (
                        <Stack key={item.id} spacing={2} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">Step {index + 1}</Typography>
                                <IconButton color="error" size="small" onClick={() => removeTimeline(index)}>
                                    <Iconify icon="mingcute:close-line" />
                                </IconButton>
                            </Stack>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                <Field.Text name={`timeline[${index}].title`} label="Step Title" />
                                <Field.Text name={`timeline[${index}].duration`} label="Duration (e.g., '15 mins')" />
                            </Box>
                            <Field.Text name={`timeline[${index}].description`} label="Description" multiline rows={2} />
                        </Stack>
                    ))}
                    <Button
                        size="small"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => appendTimeline({ title: '', description: '', duration: '' })}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Add Step
                    </Button>
                </Stack>
            </Collapse>
        </Card>
    );

    const renderSettings = () => (
        <Card>
            <CardHeader
                title="Pricing & Access"
                action={renderCollapseButton(openSettings.value, openSettings.onToggle)}
                sx={{ mb: 3 }}
            />
            <Collapse in={openSettings.value}>
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={values.isFree}
                                onChange={(e) => setValue('isFree', e.target.checked)}
                            />
                        }
                        label="This module is free"
                    />

                    {!values.isFree && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <Field.Text
                                name="price"
                                label="Price"
                                type="number"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">UGX</InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <Field.Text
                                name="discount"
                                label="Discount Amount"
                                type="number"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">UGX</InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <Field.Select name="visibility" label="Visibility">
                            <MenuItem value="public">Public (Anyone can see)</MenuItem>
                            <MenuItem value="logged_in">Logged In Only</MenuItem>
                        </Field.Select>

                        <Field.Select name="status" label="Status">
                            <MenuItem value="active">Active (Published)</MenuItem>
                            <MenuItem value="draft">Draft (Hidden)</MenuItem>
                            <MenuItem value="coming_soon">Coming Soon</MenuItem>
                        </Field.Select>
                    </Box>
                </Stack>
            </Collapse>
        </Card>
    );

    const renderActions = () => {
        const isBusy = isSubmitting || saving || uploadingCover || uploadingMats;
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isBusy}
                    startIcon={isBusy && <CircularProgress size={20} color="inherit" />}
                >
                    {uploadingMats
                        ? `Uploading Materials ${matsProgress}%`
                        : uploadingCover
                            ? 'Uploading Cover Image...'
                            : currentModule
                                ? 'Save Changes'
                                : 'Create Module'}
                </Button>
            </Box>
        );
    };

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                {renderDetails()}
                {renderContent()}
                {renderTimeline()}
                {renderSettings()}
                {renderActions()}
            </Stack>
        </Form>
    );
}
