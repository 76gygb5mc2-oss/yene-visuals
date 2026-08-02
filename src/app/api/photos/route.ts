import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { getPhotos, addPhoto, deletePhoto, updatePhoto } from '@/lib/photos';

const ADMIN_PASSWORD = process.env.YV_ADMIN_PASSWORD || 'yenevisuals2024';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_PASSWORD;
}

// GET - List all photos
export async function GET() {
  const photos = await getPhotos();
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

    const uploadedPhotos = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const id = uuidv4();
      const buffer = Buffer.from(await file.arrayBuffer());

      let optimizedBuffer = buffer;
      let thumbBuffer: Buffer | null = null;
      let width = 1200;
      let height = 800;

      try {
        const sharp = (await import('sharp')).default;
        const metadata = await sharp(buffer).metadata();

        // Optimize main image
        const optimized = sharp(buffer)
          .rotate()
          .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82, progressive: true, mozjpeg: true });

        optimizedBuffer = await optimized.toBuffer();

        const finalMeta = await sharp(optimizedBuffer).metadata();
        width = finalMeta.width || metadata.width || 1200;
        height = finalMeta.height || metadata.height || 800;

        // Create thumbnail
        thumbBuffer = await sharp(buffer)
          .rotate()
          .resize(600, 600, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: 75, progressive: true })
          .toBuffer();
      } catch {
        // sharp not available on Vercel — upload original
        optimizedBuffer = buffer;
      }

      // Upload main image to Vercel Blob
      const mainBlob = await put(`photos/${id}.jpeg`, optimizedBuffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/jpeg',
      });

      // Upload thumbnail
      let thumbUrl = mainBlob.url;
      if (thumbBuffer) {
        const thumbBlob = await put(`photos/${id}_thumb.jpeg`, thumbBuffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'image/jpeg',
        });
        thumbUrl = thumbBlob.url;
      }

      const photo = await addPhoto({
        id,
        filename: `${id}.jpeg`,
        originalName: file.name,
        category,
        title: title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        url: mainBlob.url,
        thumbUrl,
        width,
        height,
        size: optimizedBuffer.length,
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

    const result = await deletePhoto(id);
    if (!result.success) {
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

    const photo = await updatePhoto(id, updates);
    if (!photo) {
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    return Response.json({ photo });
  } catch (error) {
    console.error('Update error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}
