import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getBookings, addBooking, updateBookingStatus, deleteBooking } from '@/lib/bookings';

const ADMIN_PASSWORD = process.env.YV_ADMIN_PASSWORD || 'yenevisuals2024';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_PASSWORD;
}

// GET - List all bookings
export async function GET() {
  const bookings = await getBookings();
  return Response.json({ bookings });
}

// POST - Create new booking (public - no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, sessionType, date, location, budget, notes } = body;

    if (!name || !email || !phone || !sessionType || !date || !location || !budget) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await addBooking({
      id: uuidv4(),
      name,
      email,
      phone,
      sessionType,
      date,
      location,
      budget,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return Response.json({
      message: 'Booking submitted successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return Response.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PATCH - Update booking status (admin only)
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return Response.json({ error: 'Booking ID required' }, { status: 400 });
    }

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const booking = await updateBookingStatus(id, status);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    return Response.json({ booking });
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Delete a booking (admin only)
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Booking ID required' }, { status: 400 });
  }

  const success = await deleteBooking(id);
  if (!success) {
    return Response.json({ error: 'Booking not found' }, { status: 404 });
  }

  return Response.json({ message: 'Booking deleted' });
}
