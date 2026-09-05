export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.clinicSetting.findUnique({
      where: { id: 'clinic-settings' },
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch clinic settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await prisma.clinicSetting.upsert({
      where: { id: 'clinic-settings' },
      update: {
        clinicNameEn: body.clinicNameEn,
        clinicNameHi: body.clinicNameHi,
        doctorName: body.doctorName,
        qualifications: body.qualifications,
        rating: Number(body.rating) || 5.0,
        reviewCount: Number(body.reviewCount) || 61,
        address: body.address,
        plusCode: body.plusCode,
        phone: body.phone,
        phoneRaw: body.phoneRaw,
        whatsapp: body.whatsapp,
        email: body.email,
        isWomenOwned: Boolean(body.isWomenOwned),
        noticeBanner: body.noticeBanner,
        noticeActive: Boolean(body.noticeActive),
        aboutBio: body.aboutBio,
        philosophy: body.philosophy,
      },
      create: {
        id: 'clinic-settings',
        clinicNameEn: body.clinicNameEn || "Dr. Megha Bobde's Homoeo Clinic",
        clinicNameHi: body.clinicNameHi || "à¤¡à¥‰. à¤®à¥‡à¤˜à¤¾ à¤¬à¥‹à¤¬à¤¡à¥‡ 'à¤¸ à¤¹à¥‹à¤®à¥à¤¯à¥‹ à¤•à¥à¤²à¤¿à¤¨à¤¿à¤•",
        doctorName: body.doctorName || "Dr. Megha Bobde",
        qualifications: body.qualifications || "BHMS Homoeopath",
        rating: Number(body.rating) || 5.0,
        reviewCount: Number(body.reviewCount) || 61,
        address: body.address,
        plusCode: body.plusCode,
        phone: body.phone,
        phoneRaw: body.phoneRaw,
        whatsapp: body.whatsapp,
        email: body.email,
        isWomenOwned: Boolean(body.isWomenOwned),
        noticeBanner: body.noticeBanner,
        noticeActive: Boolean(body.noticeActive),
        aboutBio: body.aboutBio || "",
        philosophy: body.philosophy || "",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update clinic settings' }, { status: 500 });
  }
}