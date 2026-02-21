'use client';

import type { TrainingModule, TrainingMaterial, TrainingModuleFormData } from 'src/types/training-module';

import { useState, useEffect } from 'react';
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { STORAGE, FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

const COLLECTION = 'trainingModules';

// ----------------------------------------------------------------------

export function useTrainingModules(activeOnly = false) {
    const [modules, setModules] = useState<TrainingModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const constraints: any[] = [];
        if (activeOnly) {
            constraints.push(where('status', 'in', ['active', 'coming_soon']));
        }

        const q = query(collection(FIRESTORE, COLLECTION), ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as TrainingModule[];
                // Sort newest first
                setModules(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error listening to training modules:', err);
                setError('Failed to load training modules');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [activeOnly]);

    return { modules, loading, error };
}

// ----------------------------------------------------------------------

export function useTrainingModuleMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createModule = async (data: TrainingModuleFormData): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            const docData: Record<string, any> = {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(FIRESTORE, COLLECTION), docData);
            return docRef.id;
        } catch (err) {
            console.error('Error creating training module:', err);
            setError('Failed to create training module');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateModule = async (moduleId: string, data: Partial<TrainingModuleFormData>): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const updateData: Record<string, any> = {
                ...data,
                updatedAt: serverTimestamp(),
            };

            await updateDoc(doc(FIRESTORE, COLLECTION, moduleId), updateData);
            return true;
        } catch (err) {
            console.error('Error updating training module:', err);
            setError('Failed to update training module');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteModule = async (moduleId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await deleteDoc(doc(FIRESTORE, COLLECTION, moduleId));
            return true;
        } catch (err) {
            console.error('Error deleting training module:', err);
            setError('Failed to delete training module');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createModule, updateModule, deleteModule, loading, error };
}

// ----------------------------------------------------------------------
// Storage Hooks Configuration
// ----------------------------------------------------------------------

export function useTrainingImageUpload() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadCoverImage = async (file: File, moduleId: string): Promise<string> => {
        setLoading(true);
        setProgress(0);

        return new Promise((resolve, reject) => {
            const ext = file.name.split('.').pop();
            const path = `trainingModules/${moduleId}/cover_${Date.now()}.${ext}`;
            const storageRef = ref(STORAGE, path);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const pg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(Math.round(pg));
                },
                (error) => {
                    console.error('Upload failed:', error);
                    setLoading(false);
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setLoading(false);
                    resolve(url);
                }
            );
        });
    };

    const deleteImage = async (url: string) => {
        try {
            if (!url.includes('firebasestorage')) return;
            const pathStart = url.indexOf('/o/') + 3;
            const pathEnd = url.indexOf('?alt=media');
            if (pathStart > 2 && pathEnd > -1) {
                const fullPath = decodeURIComponent(url.substring(pathStart, pathEnd));
                const fileRef = ref(STORAGE, fullPath);
                await deleteObject(fileRef);
            }
        } catch (error) {
            console.error('Error deleting image from storage:', error);
        }
    };

    return { uploadCoverImage, deleteImage, loading, progress };
}

// ----------------------------------------------------------------------

export function useTrainingMaterialsUpload() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    /**
     * Uploads multiple files and returns an array of TrainingMaterial objects.
     */
    const uploadMaterials = async (files: File[], moduleId: string): Promise<TrainingMaterial[]> => {
        setLoading(true);
        setProgress(0);

        const uploadedMaterials: TrainingMaterial[] = [];
        const totalFiles = files.length;
        let completedFiles = 0;

        for (const file of files) {
            try {
                const timestamp = Date.now();
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const path = `trainingModules/${moduleId}/materials/${timestamp}_${safeName}`;
                const storageRef = ref(STORAGE, path);

                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            // Update general total progress relative to files done vs total
                            const filePg = snapshot.bytesTransferred / snapshot.totalBytes;
                            const overallPg = ((completedFiles + filePg) / totalFiles) * 100;
                            setProgress(Math.round(overallPg));
                        },
                        reject,
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedMaterials.push({
                                id: `mat-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                                name: file.name,
                                url,
                                size: file.size,
                                type: file.type || undefined,
                            });
                            completedFiles++;
                            resolve(url);
                        }
                    );
                });
            } catch (err) {
                console.error(`Failed to upload material ${file.name}:`, err);
                // Continue uploading remaining files even if one fails
            }
        }

        setLoading(false);
        return uploadedMaterials;
    };

    const deleteMaterial = async (url: string) => {
        try {
            if (!url.includes('firebasestorage')) return;
            const pathStart = url.indexOf('/o/') + 3;
            const pathEnd = url.indexOf('?alt=media');
            if (pathStart > 2 && pathEnd > -1) {
                const fullPath = decodeURIComponent(url.substring(pathStart, pathEnd));
                const fileRef = ref(STORAGE, fullPath);
                await deleteObject(fileRef);
            }
        } catch (error) {
            console.error('Error deleting material from storage:', error);
        }
    };

    return { uploadMaterials, deleteMaterial, loading, progress };
}
