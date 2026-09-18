import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [todayAppointments, pendingReviews, unreadInquiries, totalAppointments] = await Promise.all([
      prisma.appointment.findMany({
        where: { appointmentDate: today },
        orderBy: { timeSlot: 'asc' },
      }),
      prisma.testimonial.count({
        where: { isApproved: false },
      }),
      prisma.contactInquiry.count({
        where: { isRead: false },
      }),
      prisma.appointment.count(),
    ]);

    return NextResponse.json({
      todayAppointments,
      todayAppointmentCount: todayAppointments.length,
      pendingReviews,
      unreadInquiries,
      totalAppointments,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}