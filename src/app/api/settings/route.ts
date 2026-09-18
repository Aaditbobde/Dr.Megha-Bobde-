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
        experience: body.experience,
        patientsTreated: body.patientsTreated,
        rating: Number(body.rating) || 5.0,
        reviewCount: Number(body.reviewCount) || 61,
        address: body.address,
        plusCode: body.plusCode,
        phone: body.phone,
        phoneRaw: body.phoneRaw,
        whatsapp: body.whatsapp,
        email: body.email,
        instagram: body.instagram,
        yfeUrl: body.yfeUrl,
        isWomenOwned: Boolean(body.isWomenOwned),
        noticeBanner: body.noticeBanner,
        noticeActive: Boolean(body.noticeActive),
        aboutBio: body.aboutBio,
        philosophy: body.philosophy,
        tagline: body.tagline,
        heroHeadline: body.heroHeadline,
        heroSubheadline: body.heroSubheadline,
        heroImageUrl: body.heroImageUrl || null,
        doctorPhotoUrl: body.doctorPhotoUrl || null,
        yfeDescription: body.yfeDescription,
        googleMapsEmbed: body.googleMapsEmbed,
      },
      create: {
        id: 'clinic-settings',
        clinicNameEn: body.clinicNameEn || "Dr. Megha Bobde's Homoeo Clinic",
        clinicNameHi: body.clinicNameHi || "डॉ. मेघा बोबडे 'स होम्यो क्लिनिक",
        doctorName: body.doctorName || "Dr. Megha Bobde",
        qualifications: body.qualifications || "BHMS Homoeopath",
        experience: body.experience || "Over 15 Years of Clinical Experience",
        patientsTreated: body.patientsTreated || "2,000+ Patients Supported",
        rating: Number(body.rating) || 5.0,
        reviewCount: Number(body.reviewCount) || 61,
        address: body.address,
        plusCode: body.plusCode,
        phone: body.phone,
        phoneRaw: body.phoneRaw,
        whatsapp: body.whatsapp,
        email: body.email,
        instagram: body.instagram,
        yfeUrl: body.yfeUrl,
        isWomenOwned: Boolean(body.isWomenOwned),
        noticeBanner: body.noticeBanner,
        noticeActive: Boolean(body.noticeActive),
        aboutBio: body.aboutBio || "",
        philosophy: body.philosophy || "",
        tagline: body.tagline || "Root-Cause Holistic Healing",
        heroHeadline: body.heroHeadline || "Dr. Megha Bobde's",
        heroSubheadline: body.heroSubheadline || "Homoeo Clinic",
        heroImageUrl: body.heroImageUrl || null,
        doctorPhotoUrl: body.doctorPhotoUrl || null,
        yfeDescription: body.yfeDescription || "",
        googleMapsEmbed: body.googleMapsEmbed || "",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update clinic settings' }, { status: 500 });
  }
}