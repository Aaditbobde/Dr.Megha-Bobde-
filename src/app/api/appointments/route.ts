export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTimeSlots, BusinessHourData } from '@/lib/hours-helper';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const checkSlots = searchParams.get('checkSlots');

    // Public slot availability checker for a specific date
    if (checkSlots && date) {
      const targetDate = new Date(`${date}T12:00:00Z`);
      const dayOfWeek = targetDate.getDay();

      const hourConfig = await prisma.businessHour.findUnique({
        where: { dayOfWeek },
      });

      if (!hourConfig || hourConfig.isClosed) {
        return NextResponse.json({
          isClosed: true,
          dayName: hourConfig?.dayName || 'Closed',
          availableSlots: [],
          allSlots: [],
          bookedSlots: [],
        });
      }

      const allSlots = generateTimeSlots(hourConfig as unknown as BusinessHourData);

      // Fetch existing non-cancelled bookings for this date
      const [existingBookings, blockedSlots] = await Promise.all([
        prisma.appointment.findMany({
          where: {
            appointmentDate: date,
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          select: { timeSlot: true },
        }),
        prisma.blockedSlot.findMany({
          where: { date },
        }),
      ]);

      const bookedSlots = existingBookings.map((b) => b.timeSlot);

      // Check for full-day block (timeSlot is null)
      const isFullDayBlocked = blockedSlots.some((bs) => !bs.timeSlot);
      if (isFullDayBlocked) {
        const reason = blockedSlots.find((bs) => !bs.timeSlot)?.reason || 'Doctor unavailable';
        return NextResponse.json({
          isClosed: true,
          dayName: hourConfig.dayName,
          availableSlots: [],
          allSlots,
          bookedSlots,
          blockedReason: reason,
        });
      }

      // Filter out individually blocked time slots
      const blockedTimes = blockedSlots.map((bs) => bs.timeSlot).filter(Boolean);
      const availableSlots = allSlots.filter(
        (slot) => !bookedSlots.includes(slot) && !blockedTimes.includes(slot)
      );

      return NextResponse.json({
        isClosed: false,
        dayName: hourConfig.dayName,
        morningOpenTime: hourConfig.morningOpenTime,
        morningCloseTime: hourConfig.morningCloseTime,
        hasEveningSession: hourConfig.hasEveningSession,
        eveningOpenTime: hourConfig.eveningOpenTime,
        eveningCloseTime: hourConfig.eveningCloseTime,
        allSlots,
        bookedSlots,
        availableSlots,
      });
    }

    // Admin listing requires valid token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: [{ appointmentDate: 'asc' }, { timeSlot: 'asc' }],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error with appointments API:', error);
    return NextResponse.json({ error: 'Failed to process appointments request' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientName,
      phone,
      email,
      age,
      gender,
      appointmentDate,
      timeSlot,
      consultationType,
      treatmentType,
      reason,
      notes,
    } = body;

    if (!patientName || !phone || !appointmentDate || !timeSlot || !reason) {
      return NextResponse.json(
        { error: 'Please provide all required fields: name, phone, date, slot, and reason.' },
        { status: 400 }
      );
    }

    // Validate that the slot falls within clinic open hours
    const targetDate = new Date(`${appointmentDate}T12:00:00Z`);
    const dayOfWeek = targetDate.getDay();
    const hourConfig = await prisma.businessHour.findUnique({
      where: { dayOfWeek },
    });

    if (!hourConfig || hourConfig.isClosed) {
      return NextResponse.json(
        { error: `The clinic is closed on ${hourConfig?.dayName || 'this day'}.` },
        { status: 400 }
      );
    }

    const validSlots = generateTimeSlots(hourConfig as unknown as BusinessHourData);
    if (!validSlots.includes(timeSlot)) {
      return NextResponse.json(
        { error: `Requested time slot ${timeSlot} is outside official clinic consultation hours.` },
        { status: 400 }
      );
    }

    // Check if the slot is blocked by the doctor
    const blockedSlot = await prisma.blockedSlot.findFirst({
      where: {
        date: appointmentDate,
        OR: [
          { timeSlot: null },  // full-day block
          { timeSlot },        // specific slot block
        ],
      },
    });

    if (blockedSlot) {
      const reason = blockedSlot.reason || 'Doctor unavailable';
      return NextResponse.json(
        { error: `This slot is blocked: ${reason}. Please select another time.` },
        { status: 400 }
      );
    }

    // Check if slot is already reserved
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        appointmentDate,
        timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          error: `The ${timeSlot} slot on ${appointmentDate} is already reserved. Please select another time slot.`,
          isCollision: true,
        },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientName: patientName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        age: age ? Number(age) : null,
        gender: gender || 'Not specified',
        appointmentDate,
        timeSlot,
        consultationType: consultationType || 'IN_CLINIC',
        treatmentType: treatmentType || 'HOMOEOPATHY',
        reason: reason.trim(),
        status: 'CONFIRMED',
        notes: notes ? notes.trim() : '',
      },
    });

    const clinicPhone = '919270113112';
    const modalityName =
      treatmentType === 'YFE_THERAPY'
        ? 'Yogananda Flower Essences Therapy'
        : treatmentType === 'MIND_POWER_YOGA'
        ? 'Mind Power Yoga Session'
        : 'Classical Homeopathy Consultation';

    const clinicMessage = `Hello Dr. Megha, I have scheduled an appointment for ${patientName} on ${appointmentDate} at ${timeSlot} for ${modalityName}. Reason: ${reason} (Ref #${appointment.id.slice(-6)})`;
    const patientWhatsAppUrl = `https://api.whatsapp.com/send/?phone=${clinicPhone}&text=${encodeURIComponent(clinicMessage)}`;

    return NextResponse.json({
      success: true,
      appointment,
      patientWhatsAppUrl,
      message: 'Appointment successfully confirmed! We look forward to seeing you.',
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This slot is already booked. Please choose another available slot.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to schedule appointment.' }, { status: 500 });
  }
}