import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const modalities = await prisma.modalityCard.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(modalities);
  } catch (error) {
    console.error('Error fetching modalities:', error);
    return NextResponse.json({ error: 'Failed to fetch modalities' }, { status: 500 });
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
    const modality = await prisma.modalityCard.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon || 'ShieldCheck',
        order: Number(body.order) || 0,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(modality);
  } catch (error) {
    console.error('Error creating modality:', error);
    return NextResponse.json({ error: 'Failed to create modality' }, { status: 500 });
  }
}
