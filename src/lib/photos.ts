import { put, del, head } from '@vercel/blob';

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

async function readData(): Promise<string | null> {
  try {
    // Use head() to get fresh metadata, then fetch with downloadUrl (bypasses CDN cache)
    const blob = await head(DATA_PATHNAME);
    const res = await fetch(blob.downloadUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function writeData(data: string): Promise<void> {
  await put(DATA_PATHNAME, data, { 
    access: 'public', 
    addRandomSuffix: false, 
    allowOverwrite: true,
  });
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
