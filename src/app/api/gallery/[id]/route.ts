export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        category: body.category !== undefined ? body.category : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
        altText: body.altText !== undefined ? body.altText : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}