export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeLiveStatus, BusinessHourData } from '@/lib/hours-helper';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const hours = await prisma.businessHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    const liveStatus = computeLiveStatus(hours as BusinessHourData[]);

    return NextResponse.json({
      hours,
      liveStatus,
    });
  } catch (error) {
    console.error('Error fetching hours:', error);
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hours } = await req.json();
    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: 'Invalid hours array' }, { status: 400 });
    }

    for (const h of hours) {
      await prisma.businessHour.update({
        where: { dayOfWeek: h.dayOfWeek },
        data: {
          morningOpenTime: h.morningOpenTime ?? '10:30',
          morningCloseTime: h.morningCloseTime ?? '13:30',
          hasEveningSession: h.hasEveningSession !== undefined ? Boolean(h.hasEveningSession) : true,
          eveningOpenTime: h.eveningOpenTime ?? '18:00',
          eveningCloseTime: h.eveningCloseTime ?? '20:30',
          isClosed: Boolean(h.isClosed),
          slotDurationMinutes: Number(h.slotDurationMinutes) || 20,
        },
      });
    }

    const updatedHours = await prisma.businessHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    const liveStatus = computeLiveStatus(updatedHours as BusinessHourData[]);

    return NextResponse.json({
      hours: updatedHours,
      liveStatus,
    });
  } catch (error) {
    console.error('Error updating hours:', error);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}