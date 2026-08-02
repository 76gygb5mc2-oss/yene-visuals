import * as fs from 'fs';
import * as path from 'path';

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  title: string;
  url: string;
  width: number;
  height: number;
  size: number;
  featured: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'photos.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export function ensureDirs() {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function getPhotos(): Photo[] {
  ensureDirs();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function savePhotos(photos: Photo[]) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(photos, null, 2));
}

export function addPhoto(photo: Photo) {
  const photos = getPhotos();
  photos.push(photo);
  savePhotos(photos);
  return photo;
}

export function deletePhoto(id: string): boolean {
  const photos = getPhotos();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return false;

  // Delete file
  const filePath = path.join(UPLOADS_DIR, photo.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from list
  const filtered = photos.filter((p) => p.id !== id);
  savePhotos(filtered);
  return true;
}

export function updatePhoto(id: string, updates: Partial<Photo>): Photo | null {
  const photos = getPhotos();
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return null;

  photos[index] = { ...photos[index], ...updates };
  savePhotos(photos);
  return photos[index];
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}
