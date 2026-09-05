import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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
    const service = await prisma.service.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: body.category || 'General',
        summary: body.summary,
        description: body.description,
        icon: body.icon || 'Activity',
        symptoms: body.symptoms || '',
        approach: body.approach || '',
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}