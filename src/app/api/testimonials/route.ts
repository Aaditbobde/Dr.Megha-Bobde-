import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    // Admin can request all (including unapproved)
    if (all === 'true') {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (token && verifyAdminToken(token)) {
        const testimonials = await prisma.testimonial.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(testimonials);
      }
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    const settings = await prisma.clinicSetting.findUnique({
      where: { id: 'clinic-settings' },
    });

    return NextResponse.json({
      testimonials,
      stats: {
        averageRating: settings?.rating || 5.0,
        totalReviews: settings?.reviewCount || 61,
        verifiedSource: 'Google Business Profile',
      },
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, condition, rating, reviewText } = body;

    if (!patientName || !condition || !reviewText) {
      return NextResponse.json(
        { error: 'Please provide patient name, condition treated, and your review.' },
        { status: 400 }
      );
    }

    // Check if admin is creating on behalf of patient
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const isAdmin = token ? !!verifyAdminToken(token) : false;

    const testimonial = await prisma.testimonial.create({
      data: {
        patientName: patientName.trim(),
        condition: condition.trim(),
        rating: Number(rating) || 5.0,
        reviewText: reviewText.trim(),
        dateString: body.dateString || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
        isApproved: isAdmin ? true : false, // Admin-created reviews are auto-approved
        isFeatured: isAdmin ? true : false,
      },
    });

    return NextResponse.json({
      success: true,
      testimonial,
      message: 'Thank you for your feedback! Your review will be displayed upon verification.',
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}