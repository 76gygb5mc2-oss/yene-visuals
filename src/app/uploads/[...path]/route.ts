import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const MIME_TYPES: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filename = segments.join('/');
  
  // Prevent directory traversal
  if (filename.includes('..') || filename.includes('~')) {
    return new Response('Not found', { status: 404 });
  }
  
  const filePath = path.join(UPLOADS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }
  
  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  const fileBuffer = fs.readFileSync(filePath);
  
  return new Response(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
