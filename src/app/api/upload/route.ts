export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.' },
        { status: 400 }
      );
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: 'File too large. Maximum image size is 10MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalExt = path.extname(file.name) || '.jpg';
    const cleanExt = originalExt.toLowerCase().replace(/[^a-z0-9.]/g, '');
    const baseName = path.basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    const filename = `clinic-${Date.now()}-${baseName || 'photo'}${cleanExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/api/uploads/gallery/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}