import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    const where: any = {};
    if (date) where.date = date;

    const blockedSlots = await prisma.blockedSlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
    });
    return NextResponse.json(blockedSlots);
  } catch (error) {
    console.error('Error fetching blocked slots:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 });
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
    const blocked = await prisma.blockedSlot.create({
      data: {
        date: body.date,
        timeSlot: body.timeSlot || null,
        reason: body.reason || null,
      },
    });

    return NextResponse.json(blocked);
  } catch (error) {
    console.error('Error creating blocked slot:', error);
    return NextResponse.json({ error: 'Failed to block slot' }, { status: 500 });
  }
}
