import { useState, useEffect, useCallback } from 'react';
import { StorageItem, getAllFiles, saveFile, deleteFile, getFile } from '../services/storage';

export function useStorage() {
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFiles = useCallback(async () => {
    try {
      setLoading(true);
      const allFiles = await getAllFiles();
      setFiles(allFiles.sort((a, b) => b.timestamp - a.timestamp)); // newest first
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const addFile = useCallback(async (item: Omit<StorageItem, 'timestamp'>) => {
    await saveFile(item);
    await refreshFiles();
  }, [refreshFiles]);

  const removeFile = useCallback(async (id: string) => {
    await deleteFile(id);
    await refreshFiles();
  }, [refreshFiles]);
  
  const fetchFile = useCallback(async (id: string) => {
      return await getFile(id);
  }, []);

  return {
    files,
    loading,
    refreshFiles,
    addFile,
    removeFile,
    fetchFile
  };
}
