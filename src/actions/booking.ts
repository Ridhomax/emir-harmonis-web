"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getPrice } from "@/lib/pricing";

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

async function sendWaFonnte(target: string, message: string) {
  if (!FONNTE_TOKEN) {
    console.warn("FONNTE_TOKEN is not set. WhatsApp message not sent.");
    return;
  }
  
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": FONNTE_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        target,
        message,
        countryCode: "62"
      })
    });
    const data = await res.json();
    console.log("Fonnte Response:", data);
  } catch (error) {
    console.error("Fonnte Error:", error);
  }
}


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

    const basePrice = getPrice(vehicleType, serviceType);
    let totalPrice = basePrice;

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
        basePrice,
        additionalCost: 0,
        totalPrice,
        discountApplied,
      },
    });

    // Send automatic WA message to customer
    const waMessage = `Halo *${booking.customerName}*,\n\nTerima kasih! Reservasi Anda di *Emir Harmonis* berhasil dibuat dan sedang menunggu konfirmasi admin.\n\nID Booking: ${booking.id.split('-')[0]}\nLayanan: ${booking.serviceType} (${booking.vehicleType})\nJadwal: ${new Date(booking.bookingDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}\nTotal Biaya (Estimasi): Rp ${booking.totalPrice?.toLocaleString('id-ID')}\n\nPembayaran dilakukan di lokasi setelah pengerjaan selesai. Sampai jumpa!`;
    await sendWaFonnte(booking.whatsapp, waMessage);

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
        totalPrice: booking.totalPrice,
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

    // Send WhatsApp notification if confirmed
    if (status === 'CONFIRMED') {
      const message = `Halo *${booking.customerName}*,\n\nReservasi Anda di *Emir Harmonis* telah *DIKONFIRMASI*!\n\nID Booking: ${booking.id.split('-')[0]}\nLayanan: ${booking.serviceType} (${booking.vehicleType})\nJadwal: ${new Date(booking.bookingDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}\nTotal Biaya (Estimasi): Rp ${booking.totalPrice?.toLocaleString('id-ID')}\n\nSilakan datang ke lokasi kami tepat waktu. Terima kasih!`;
      await sendWaFonnte(booking.whatsapp, message);
    } else if (status === 'COMPLETED') {
      const message = `Halo *${booking.customerName}*,\n\nPengerjaan salon kendaraan Anda telah *SELESAI*!\nTerima kasih telah mempercayakan kendaraan Anda pada *Emir Harmonis*. Jangan lupa untuk datang kembali!`;
      await sendWaFonnte(booking.whatsapp, message);
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
        paymentProof: booking.paymentProof,
        basePrice: booking.basePrice,
        additionalCost: booking.additionalCost,
        additionalCostReason: booking.additionalCostReason,
        totalPrice: booking.totalPrice,
        discountApplied: booking.discountApplied
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

export async function updateBookingCost(id: string, additionalCost: number, additionalCostReason: string) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return { success: false, error: "Booking tidak ditemukan." };
    }

    // Recalculate total price
    const newTotalPrice = Math.floor((booking.basePrice + additionalCost) * ((100 - booking.discountApplied) / 100));

    await prisma.booking.update({
      where: { id },
      data: {
        additionalCost,
        additionalCostReason,
        totalPrice: newTotalPrice,
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating cost:", error);
    return { success: false, error: "Gagal mengupdate biaya." };
  }
}
