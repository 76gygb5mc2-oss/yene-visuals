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
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
      const filename = `${id}.${ext}`;
      const contentType = file.type || 'image/jpeg';

      // Upload main image to Vercel Blob
      const mainBlob = await put(`photos/${filename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType,
      });

      // For thumbnails, we'll use the same image (Vercel Image Optimization handles resizing)
      const thumbUrl = mainBlob.url;

      const photo = await addPhoto({
        id,
        filename,
        originalName: file.name,
        category,
        title: title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        url: mainBlob.url,
        thumbUrl,
        width: 1200,
        height: 800,
        size: file.size,
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
    return Response.json({ error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
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

    // deletePhoto handles both blob cleanup and DB removal
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
