import { put, del } from '@vercel/blob';

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  title: string;
  url: string;
  thumbUrl?: string;
  width: number;
  height: number;
  size: number;
  featured: boolean;
  createdAt: string;
}

const DATA_PATHNAME = 'data/photos.json';

// Store the known URL after first write
let knownDataUrl: string | null = null;

async function getDataUrl(): Promise<string> {
  if (knownDataUrl) return knownDataUrl;
  // Construct the URL from the store domain
  // Vercel Blob URLs follow pattern: https://<store>.public.blob.vercel-storage.com/<pathname>
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  // Extract store ID from token: vercel_blob_rw_<storeId>_<rest>
  const match = token.match(/vercel_blob_rw_([^_]+)_/);
  if (match) {
    knownDataUrl = `https://${match[1]}.public.blob.vercel-storage.com/${DATA_PATHNAME}`;
    return knownDataUrl;
  }
  throw new Error('Cannot determine blob store URL');
}

async function readData(): Promise<string | null> {
  try {
    const url = await getDataUrl();
    const res = await fetch(url + `?t=${Date.now()}`, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function writeData(data: string): Promise<void> {
  const result = await put(DATA_PATHNAME, data, { 
    access: 'public', 
    addRandomSuffix: false, 
    allowOverwrite: true,
  });
  knownDataUrl = result.url;
}

export async function getPhotos(): Promise<Photo[]> {
  const raw = await readData();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  await writeData(JSON.stringify(photos, null, 2));
}

export async function addPhoto(photo: Photo): Promise<Photo> {
  const photos = await getPhotos();
  photos.push(photo);
  await savePhotos(photos);
  return photo;
}

export async function deletePhoto(id: string): Promise<{ success: boolean; photo?: Photo }> {
  const photos = await getPhotos();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return { success: false };

  // Delete image blob and thumbnail blob
  try {
    if (photo.url) await del(photo.url);
    if (photo.thumbUrl && photo.thumbUrl !== photo.url) await del(photo.thumbUrl);
  } catch {
    // blob may already be gone
  }

  const filtered = photos.filter((p) => p.id !== id);
  await savePhotos(filtered);
  return { success: true, photo };
}

export async function updatePhoto(id: string, updates: Partial<Photo>): Promise<Photo | null> {
  const photos = await getPhotos();
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return null;

  photos[index] = { ...photos[index], ...updates };
  await savePhotos(photos);
  return photos[index];
}
