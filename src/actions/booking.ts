"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";

export async function createBooking(prevState: any, formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const serviceType = formData.get("serviceType") as string;
    const bookingDateStr = formData.get("bookingDate") as string;

    if (!customerName || !whatsapp || !vehicleType || !serviceType || !bookingDateStr) {
      return { success: false, message: "", error: "Semua field wajib diisi." };
    }

    const bookingDate = new Date(bookingDateStr);

    // Validate if slot is already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        bookingDate: bookingDate,
        status: { not: 'CANCELLED' }
      }
    });

    if (existingBooking) {
      return { success: false, message: "", error: "Maaf, slot waktu ini sudah dipesan. Silakan pilih waktu lain." };
    }

    const PRICING: Record<string, number> = {
      "Cuci Hidrolik": 70000,
      "Poles Body": 300000,
      "Nano Coating": 1500000,
      "Auto Detailing": 800000,
    };
    let totalPrice = PRICING[serviceType] || 50000;

    const session = await getSession();
    let discountApplied = 0;
    const usePoints = formData.get("usePoints") === "on";

    if (session && usePoints) {
      const user = await prisma.user.findUnique({ where: { id: session.id as string } });
      if (user && user.points >= 300) {
        discountApplied = 20; // 20%
        totalPrice = Math.floor(totalPrice * 0.8);
        await prisma.user.update({
          where: { id: user.id },
          data: { points: { decrement: 300 } }
        });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        customerName,
        whatsapp,
        vehicleType,
        serviceType,
        bookingDate,
        userId: session ? (session.id as string) : undefined,
        totalPrice,
        discountApplied,
      },
    });

    revalidatePath("/admin");
    return { 
      success: true, 
      message: "Booking berhasil dibuat! Berikut adalah detail reservasi Anda.", 
      error: "",
      booking: {
        id: booking.id,
        customerName: booking.customerName,
        whatsapp: booking.whatsapp,
        vehicleType: booking.vehicleType,
        serviceType: booking.serviceType,
        bookingDate: booking.bookingDate.toISOString(),
      }
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: "", error: "Gagal membuat booking. Silakan coba lagi." };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { user: true }
    });

    // Give points if completed and not awarded yet
    if (status === 'COMPLETED' && !booking.pointsAwarded && booking.userId) {
       const earnedPoints = Math.floor(booking.totalPrice / 10000);
       if (earnedPoints > 0) {
         await prisma.user.update({
           where: { id: booking.userId },
           data: { points: { increment: earnedPoints } }
         });
       }
       await prisma.booking.update({
         where: { id },
         data: { pointsAwarded: true }
       });
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal mengupdate status." };
  }
}

export async function checkBookingStatus(prevState: any, formData: FormData) {
  try {
    const id = formData.get("bookingId") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (!id || !whatsapp) {
      return { success: false, error: "ID Booking dan Nomor WhatsApp wajib diisi." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking || booking.whatsapp !== whatsapp) {
      return { success: false, error: "Pesanan tidak ditemukan atau Nomor WhatsApp tidak cocok." };
    }

    return { 
      success: true, 
      booking: {
        id: booking.id,
        customerName: booking.customerName,
        vehicleType: booking.vehicleType,
        serviceType: booking.serviceType,
        bookingDate: booking.bookingDate.toISOString(),
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        paymentProof: booking.paymentProof
      }
    };
  } catch (error) {
    console.error("Error checking booking status:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function submitPayment(prevState: any, formData: FormData) {
  try {
    const bookingId = formData.get("bookingId") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    
    if (!bookingId || !paymentMethod) {
      return { success: false, error: "Data tidak lengkap." };
    }

    let paymentProofPath = null;

    if (paymentMethod === "Bank") {
      const file = formData.get("paymentProof") as File;
      if (!file || file.size === 0) {
        return { success: false, error: "Bukti pembayaran wajib diunggah untuk transfer bank." };
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${bookingId}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { join } = await import('path');
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      try {
        const { writeFile } = await import('fs/promises');
        await writeFile(join(uploadDir, filename), buffer);
      } catch (e: any) {
         if (e.code === 'ENOENT') {
            const { mkdir, writeFile } = await import('fs/promises');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(join(uploadDir, filename), buffer);
         } else {
            throw e;
         }
      }

      paymentProofPath = `/uploads/${filename}`;
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentMethod,
        paymentProof: paymentProofPath,
      }
    });

    return { success: true, message: "Pembayaran berhasil diproses." };
  } catch (error) {
    console.error("Error submitting payment:", error);
    return { success: false, error: "Gagal memproses pembayaran." };
  }
}
