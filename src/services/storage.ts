import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface StorageItem {
  id: string;
  blob: Blob;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  toolUsed?: string;
  toolSlug?: string;
  thumbnail?: string; // base64 or blob URL
  timestamp: number;
}

interface ImgForgeDB extends DBSchema {
  files: {
    key: string;
    value: StorageItem;
    indexes: {
      'by-timestamp': number;
    };
  };
  sessions: {
    key: string;
    value: {
      toolId: string;
      state: 'idle' | 'uploaded' | 'processing' | 'done' | 'error';
      files: { blob: Blob; name: string; type: string; lastModified: number }[];
      results: {
        originalSize: number;
        processedSize: number;
        downloadName: string;
        format?: string;
        processedBlob: Blob;
      }[];
      timestamp: number;
    };
  };
}

const DB_NAME = 'imgforge-storage';
const DB_VERSION = 1;
const MAX_ITEMS = 50;
const MAX_STORAGE_BYTES = 200 * 1024 * 1024; // 200MB
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

let dbPromise: Promise<IDBPDatabase<ImgForgeDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ImgForgeDB>(DB_NAME, DB_VERSION, {
      upgrade(db: any, oldVersion: number) {
        if (oldVersion < 1) {
          const store = db.createObjectStore('files', { keyPath: 'id' });
          store.createIndex('by-timestamp', 'timestamp');
          db.createObjectStore('sessions', { keyPath: 'toolId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function generateThumbnail(blob: Blob): Promise<string | undefined> {
  if (!blob.type.startsWith('image/')) return undefined;
  try {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    
    const MAX_DIM = 200;
    let width = bitmap.width;
    let height = bitmap.height;
    
    if (width > height) {
      if (width > MAX_DIM) {
        height *= MAX_DIM / width;
        width = MAX_DIM;
      }
    } else {
      if (height > MAX_DIM) {
        width *= MAX_DIM / height;
        height = MAX_DIM;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(bitmap, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.5);
  } catch (error) {
    console.warn('Failed to generate thumbnail', error);
    return undefined;
  }
}

export async function saveFile(item: Omit<StorageItem, 'timestamp'>): Promise<void> {
  try {
    const db = await getDB();
    const thumbnail = item.thumbnail || await generateThumbnail(item.blob);
    const newItem: StorageItem = {
      ...item,
      thumbnail,
      timestamp: Date.now(),
    };
    await db.put('files', newItem);
    await cleanupOldFiles();
  } catch (error) {
    console.error('Failed to save file to IndexedDB', error);
  }
}

export async function getFile(id: string): Promise<StorageItem | undefined> {
  try {
    const db = await getDB();
    return await db.get('files', id);
  } catch (error) {
    console.error('Failed to get file from IndexedDB', error);
    return undefined;
  }
}

export async function getAllFiles(): Promise<StorageItem[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('files', 'by-timestamp');
  } catch (error) {
    console.error('Failed to get all files from IndexedDB', error);
    return [];
  }
}

export async function deleteFile(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('files', id);
  } catch (error) {
    console.error('Failed to delete file from IndexedDB', error);
  }
}

export async function cleanupOldFiles(): Promise<void> {
  try {
    const db = await getDB();
    const items = await db.getAllFromIndex('files', 'by-timestamp');
    const now = Date.now();

    let totalSize = 0;
    const toDelete: string[] = [];

    // Items are sorted by timestamp ascending (oldest first)
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      totalSize += item.size;
      
      const isTooOld = now - item.timestamp > MAX_AGE_MS;
      const isOverCount = items.length - toDelete.length > MAX_ITEMS;
      const isOverSize = totalSize > MAX_STORAGE_BYTES;

      // Keep the newest, if we exceed limits, we'll mark older ones for deletion in the next iteration
    }
    
    // Recalculate properly: sort newest first to keep them, mark others for deletion
    items.sort((a: any, b: any) => b.timestamp - a.timestamp);
    let currentSize = 0;
    let keptCount = 0;

    for (const item of items) {
      const isTooOld = now - item.timestamp > MAX_AGE_MS;
      
      if (isTooOld || keptCount >= MAX_ITEMS || currentSize + item.size > MAX_STORAGE_BYTES) {
        toDelete.push(item.id);
      } else {
        keptCount++;
        currentSize += item.size;
      }
    }

    if (toDelete.length > 0) {
      const tx = db.transaction('files', 'readwrite');
      await Promise.all(toDelete.map((id) => tx.store.delete(id)));
      await tx.done;
    }
  } catch (error) {
    console.error('Failed to cleanup IndexedDB files', error);
  }
}

export async function saveSession(
  toolId: string,
  state: 'idle' | 'uploaded' | 'processing' | 'done' | 'error',
  files: File[],
  results: any[]
): Promise<void> {
  try {
    const db = await getDB();
    const sessionFiles = files.map(f => ({
      blob: new Blob([f], { type: f.type }),
      name: f.name,
      type: f.type,
      lastModified: f.lastModified,
    }));
    const sessionResults = results.map(r => ({
      originalSize: r.originalSize,
      processedSize: r.processedSize,
      downloadName: r.downloadName,
      format: r.format,
      processedBlob: r.processedBlob,
    }));
    await db.put('sessions', {
      toolId,
      state,
      files: sessionFiles,
      results: sessionResults,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to save session to IndexedDB', error);
  }
}

export async function getSession(toolId: string) {
  try {
    const db = await getDB();
    const session = await db.get('sessions', toolId);
    if (!session) return null;
    
    const files = session.files.map((f: any) => new File([f.blob], f.name, { type: f.type, lastModified: f.lastModified }));
    const results = session.results.map((r: any, i: number) => ({
      ...r,
      originalFile: files[i],
    }));
    
    return { ...session, files, results };
  } catch (error) {
    console.error('Failed to get session from IndexedDB', error);
    return null;
  }
}
