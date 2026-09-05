export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const whereClause: any = {};
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where: whereClause,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, imageUrl, altText, order, isFeatured } = body;

    if (!title || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Title, category, and image URL are required.' },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        imageUrl: imageUrl.trim(),
        altText: altText ? altText.trim() : title.trim(),
        order: Number(order) || 0,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ error: 'Failed to add image to gallery' }, { status: 500 });
  }
}