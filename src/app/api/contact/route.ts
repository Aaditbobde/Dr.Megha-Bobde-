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

    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone number, and message are required.' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      inquiry,
      message: 'Thank you for reaching out! Dr. Megha Bobde\'s clinic team will contact you shortly.',
    });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}