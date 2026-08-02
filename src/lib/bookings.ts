import { supabaseAdmin, supabase } from './supabase';

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

// Convert DB row (snake_case) → app interface (camelCase)
function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    sessionType: row.session_type as string,
    date: row.date as string,
    location: row.location as string,
    budget: row.budget as string,
    notes: row.notes as string,
    status: row.status as Booking['status'],
    createdAt: row.created_at as string,
  };
}

// Convert app interface (camelCase) → DB row (snake_case)
function bookingToRow(booking: Partial<Booking>) {
  const row: Record<string, unknown> = {};
  if (booking.id !== undefined) row.id = booking.id;
  if (booking.name !== undefined) row.name = booking.name;
  if (booking.email !== undefined) row.email = booking.email;
  if (booking.phone !== undefined) row.phone = booking.phone;
  if (booking.sessionType !== undefined) row.session_type = booking.sessionType;
  if (booking.date !== undefined) row.date = booking.date;
  if (booking.location !== undefined) row.location = booking.location;
  if (booking.budget !== undefined) row.budget = booking.budget;
  if (booking.notes !== undefined) row.notes = booking.notes;
  if (booking.status !== undefined) row.status = booking.status;
  if (booking.createdAt !== undefined) row.created_at = booking.createdAt;
  return row;
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return (data || []).map(rowToBooking);
}

export async function addBooking(booking: Booking): Promise<Booking> {
  const row = bookingToRow(booking);
  // Use anon client for public booking submissions (goes through RLS)
  const { data, error } = await supabase
    .from('bookings')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('Error adding booking:', error);
    throw new Error(`Failed to add booking: ${error.message}`);
  }

  return rowToBooking(data);
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<Booking | null> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    return null;
  }

  return rowToBooking(data);
}

export async function deleteBooking(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting booking:', error);
    return false;
  }

  return true;
}
