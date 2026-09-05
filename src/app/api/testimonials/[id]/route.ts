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

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        isApproved: body.isApproved !== undefined ? Boolean(body.isApproved) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        patientName: body.patientName !== undefined ? body.patientName : undefined,
        condition: body.condition !== undefined ? body.condition : undefined,
        reviewText: body.reviewText !== undefined ? body.reviewText : undefined,
        rating: body.rating !== undefined ? Number(body.rating) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}