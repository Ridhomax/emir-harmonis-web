import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const startDate = new Date(`${dateStr}T00:00:00.000+07:00`); // Assuming WIB (UTC+7) based on context
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lt: endDate,
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        bookingDate: true,
      },
    });

    // Extract booked times in HH:MM format (local to UTC+7)
    const bookedSlots = bookings.map((booking) => {
      // Use standard JS date methods but adjust to +7 offset
      const utcDate = new Date(booking.bookingDate);
      const localDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
      
      const hours = localDate.getUTCHours().toString().padStart(2, '0');
      const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
