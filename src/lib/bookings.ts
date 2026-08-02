import * as fs from 'fs';
import * as path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function ensureDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getBookings(): Booking[] {
  ensureDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function saveBookings(bookings: Booking[]) {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export function addBooking(booking: Booking): Booking {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
  return booking;
}

export function updateBookingStatus(
  id: string,
  status: Booking['status']
): Booking | null {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index] = { ...bookings[index], status };
  saveBookings(bookings);
  return bookings[index];
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return false;

  saveBookings(filtered);
  return true;
}
