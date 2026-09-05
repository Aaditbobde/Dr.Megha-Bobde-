export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export async function GET(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  try {
    const pathSegments = params.path || [];
    if (pathSegments.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const baseDir = path.join(process.cwd(), 'public', 'uploads');
    const safePath = path.resolve(baseDir, ...pathSegments);

    // Security check: prevent directory traversal outside public/uploads
    if (!safePath.startsWith(baseDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(safePath)) {
      return new NextResponse('Image Not Found', { status: 404 });
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = await fs.promises.readFile(safePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}