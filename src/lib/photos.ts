import { put, del, list } from '@vercel/blob';

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

const DATA_KEY = 'data/photos.json';

async function readBlob(key: string): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    return await res.text();
  } catch {
    return null;
  }
}

async function writeBlob(key: string, data: string): Promise<void> {
  await put(key, data, { access: 'public', addRandomSuffix: false });
}

export async function getPhotos(): Promise<Photo[]> {
  const raw = await readBlob(DATA_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  await writeBlob(DATA_KEY, JSON.stringify(photos, null, 2));
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
    if (photo.thumbUrl) await del(photo.thumbUrl);
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
