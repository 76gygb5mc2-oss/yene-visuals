import { put, list } from '@vercel/blob';

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

const DATA_KEY = 'data/bookings.json';

async function readBlob(key: string): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.text();
  } catch {
    return null;
  }
}

async function writeBlob(key: string, data: string): Promise<void> {
  await put(key, data, { access: 'public', addRandomSuffix: false, allowOverwrite: true });
}

export async function getBookings(): Promise<Booking[]> {
  const raw = await readBlob(DATA_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: Booking[]): Promise<void> {
  await writeBlob(DATA_KEY, JSON.stringify(bookings, null, 2));
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
