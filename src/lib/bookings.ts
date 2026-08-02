import { put } from '@vercel/blob';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  date: string;
  location: string;
  budget: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const DATA_PATHNAME = 'data/bookings.json';

let knownDataUrl: string | null = null;

async function getDataUrl(): Promise<string> {
  if (knownDataUrl) return knownDataUrl;
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
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
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
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

export async function getBookings(): Promise<Booking[]> {
  const raw = await readData();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: Booking[]): Promise<void> {
  await writeData(JSON.stringify(bookings, null, 2));
}

export async function addBooking(booking: Booking): Promise<Booking> {
  const bookings = await getBookings();
  bookings.push(booking);
  await saveBookings(bookings);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<Booking | null> {
  const bookings = await getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index] = { ...bookings[index], status };
  await saveBookings(bookings);
  return bookings[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  const bookings = await getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return false;

  await saveBookings(filtered);
  return true;
}
