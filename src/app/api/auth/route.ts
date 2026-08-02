import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.YV_ADMIN_PASSWORD || 'yenevisuals2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      return Response.json({ token: ADMIN_PASSWORD, message: 'Login successful' });
    }

    return Response.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}
