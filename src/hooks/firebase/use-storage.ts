'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';

import { STORAGE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export type UploadedFile = {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
};

// ----------------------------------------------------------------------

export function useStorageUpload(basePath: string = 'uploads') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: File, customPath?: string): Promise<UploadedFile | null> => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);

        // Generate unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${safeName}`;
        const filePath = customPath ? `${basePath}/${customPath}/${fileName}` : `${basePath}/${fileName}`;

        const storageRef = ref(STORAGE, filePath);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        setProgress(100);

        // Get download URL
        const url = await getDownloadURL(snapshot.ref);

        return {
          url,
          path: filePath,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Failed to upload file');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [basePath]
  );

  const uploadMultiple = useCallback(
    async (files: File[], customPath?: string): Promise<UploadedFile[]> => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);

        const results: UploadedFile[] = [];
        const total = files.length;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const result = await uploadFile(file, customPath);
          if (result) {
            results.push(result);
          }
          setProgress(Math.round(((i + 1) / total) * 100));
        }

        return results;
      } catch (err) {
        console.error('Error uploading files:', err);
        setError('Failed to upload files');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  const deleteFile = useCallback(async (path: string): Promise<boolean> => {
    try {
      const storageRef = ref(STORAGE, path);
      await deleteObject(storageRef);
      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    progress,
    uploadFile,
    uploadMultiple,
    deleteFile,
  };
}

// ----------------------------------------------------------------------

export function useProductImageUpload() {
  return useStorageUpload('products');
}

export function useCategoryImageUpload() {
  return useStorageUpload('categories');
}

export function useUserAvatarUpload() {
  return useStorageUpload('users');
}
