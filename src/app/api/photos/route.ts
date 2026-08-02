import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getPhotos, addPhoto, deletePhoto, updatePhoto, getUploadsDir } from '@/lib/photos';

const ADMIN_PASSWORD = process.env.YV_ADMIN_PASSWORD || 'yenevisuals2024';

// Max dimensions for web display
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;
const JPEG_QUALITY = 82;
const THUMB_SIZE = 600;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_PASSWORD;
}

// GET - List all photos
export async function GET() {
  const photos = getPhotos();
  return Response.json({ photos });
}

// POST - Upload photo(s)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];
    const category = (formData.get('category') as string) || 'Portraits';
    const title = (formData.get('title') as string) || '';
    const featured = formData.get('featured') === 'true';

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadsDir = getUploadsDir();
    const uploadedPhotos = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const id = uuidv4();
      const filename = `${id}.jpeg`; // Always save as optimized JPEG
      const thumbFilename = `${id}_thumb.jpeg`;
      const filePath = path.join(uploadsDir, filename);
      const thumbPath = path.join(uploadsDir, thumbFilename);

      const buffer = Buffer.from(await file.arrayBuffer());

      let width = 1200;
      let height = 800;
      let finalSize = buffer.length;

      try {
        const sharp = (await import('sharp')).default;
        const metadata = await sharp(buffer).metadata();
        const origW = metadata.width || 1200;
        const origH = metadata.height || 800;

        // Resize if larger than max dimensions, always convert to optimized JPEG
        const optimized = sharp(buffer)
          .rotate() // Auto-rotate based on EXIF
          .resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });

        const optimizedBuffer = await optimized.toBuffer();
        fs.writeFileSync(filePath, optimizedBuffer);
        finalSize = optimizedBuffer.length;

        // Get final dimensions
        const finalMeta = await sharp(optimizedBuffer).metadata();
        width = finalMeta.width || origW;
        height = finalMeta.height || origH;

        // Create thumbnail
        const thumbBuffer = await sharp(buffer)
          .rotate()
          .resize(THUMB_SIZE, THUMB_SIZE, {
            fit: 'cover',
            position: 'centre',
          })
          .jpeg({ quality: 75, progressive: true })
          .toBuffer();
        fs.writeFileSync(thumbPath, thumbBuffer);

      } catch {
        // sharp failed — save original
        fs.writeFileSync(filePath, buffer);
      }

      const photo = addPhoto({
        id,
        filename,
        originalName: file.name,
        category,
        title: title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        url: `/uploads/${filename}`,
        width,
        height,
        size: finalSize,
        featured,
        createdAt: new Date().toISOString(),
      });

      uploadedPhotos.push(photo);
    }

    return Response.json({
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE - Delete a photo
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: 'Photo ID required' }, { status: 400 });
    }

    // Also delete thumbnail
    const photos = getPhotos();
    const photo = photos.find(p => p.id === id);
    if (photo) {
      const thumbPath = path.join(getUploadsDir(), `${photo.id}_thumb.jpeg`);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    const success = deletePhoto(id);
    if (!success) {
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    return Response.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// PATCH - Update photo
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await request.json();
    if (!id) {
      return Response.json({ error: 'Photo ID required' }, { status: 400 });
    }

    const photo = updatePhoto(id, updates);
    if (!photo) {
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    return Response.json({ photo });
  } catch (error) {
    console.error('Update error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}
