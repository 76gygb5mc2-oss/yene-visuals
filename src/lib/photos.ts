import { put, del } from '@vercel/blob';
import { supabaseAdmin } from './supabase';

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

// Convert DB row (snake_case) → app interface (camelCase)
function rowToPhoto(row: Record<string, unknown>): Photo {
  return {
    id: row.id as string,
    filename: row.filename as string,
    originalName: row.original_name as string,
    category: row.category as string,
    title: row.title as string,
    url: row.url as string,
    thumbUrl: (row.thumb_url as string) || undefined,
    width: row.width as number,
    height: row.height as number,
    size: row.size as number,
    featured: row.featured as boolean,
    createdAt: row.created_at as string,
  };
}

// Convert app interface (camelCase) → DB row (snake_case)
function photoToRow(photo: Partial<Photo>) {
  const row: Record<string, unknown> = {};
  if (photo.id !== undefined) row.id = photo.id;
  if (photo.filename !== undefined) row.filename = photo.filename;
  if (photo.originalName !== undefined) row.original_name = photo.originalName;
  if (photo.category !== undefined) row.category = photo.category;
  if (photo.title !== undefined) row.title = photo.title;
  if (photo.url !== undefined) row.url = photo.url;
  if (photo.thumbUrl !== undefined) row.thumb_url = photo.thumbUrl;
  if (photo.width !== undefined) row.width = photo.width;
  if (photo.height !== undefined) row.height = photo.height;
  if (photo.size !== undefined) row.size = photo.size;
  if (photo.featured !== undefined) row.featured = photo.featured;
  if (photo.createdAt !== undefined) row.created_at = photo.createdAt;
  return row;
}

export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabaseAdmin
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return (data || []).map(rowToPhoto);
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  // Bulk replace — clear and re-insert (used only for migration scenarios)
  const { error: delError } = await supabaseAdmin.from('photos').delete().neq('id', '');
  if (delError) console.error('Error clearing photos:', delError);

  if (photos.length > 0) {
    const rows = photos.map(photoToRow);
    const { error: insError } = await supabaseAdmin.from('photos').insert(rows);
    if (insError) console.error('Error inserting photos:', insError);
  }
}

export async function addPhoto(photo: Photo): Promise<Photo> {
  const row = photoToRow(photo);
  const { data, error } = await supabaseAdmin
    .from('photos')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('Error adding photo:', error);
    throw new Error(`Failed to add photo: ${error.message}`);
  }

  return rowToPhoto(data);
}

export async function deletePhoto(id: string): Promise<{ success: boolean; photo?: Photo }> {
  // Fetch the photo first to get blob URLs
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('photos')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return { success: false };

  const photo = rowToPhoto(existing);

  // Delete image blobs from Vercel Blob storage
  try {
    if (photo.url) await del(photo.url);
    if (photo.thumbUrl && photo.thumbUrl !== photo.url) await del(photo.thumbUrl);
  } catch {
    // blob may already be gone
  }

  // Delete from Supabase
  const { error: delError } = await supabaseAdmin
    .from('photos')
    .delete()
    .eq('id', id);

  if (delError) {
    console.error('Error deleting photo from DB:', delError);
    return { success: false };
  }

  return { success: true, photo };
}

export async function updatePhoto(id: string, updates: Partial<Photo>): Promise<Photo | null> {
  const row = photoToRow(updates);
  const { data, error } = await supabaseAdmin
    .from('photos')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating photo:', error);
    return null;
  }

  return rowToPhoto(data);
}
