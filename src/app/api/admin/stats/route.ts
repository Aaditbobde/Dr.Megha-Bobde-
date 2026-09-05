export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalAppointments,
      pendingAppointments,
      totalServices,
      totalTestimonials,
      pendingReviews,
      totalBlogPosts,
      unreadInquiries,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isApproved: false } }),
      prisma.blogPost.count(),
      prisma.contactInquiry.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({
      totalAppointments,
      pendingAppointments,
      totalServices,
      totalTestimonials,
      pendingReviews,
      totalBlogPosts,
      unreadInquiries,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}