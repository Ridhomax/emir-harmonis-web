import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password, whatsapp, address, dob, referredBy } = await req.json();

    if (!name || !email || !password || !whatsapp) {
      return NextResponse.json({ error: "Name, email, password, and whatsapp are required" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });

    const existingWa = await prisma.user.findUnique({ where: { whatsapp } });
    if (existingWa) return NextResponse.json({ error: "Nomor WhatsApp sudah terdaftar" }, { status: 400 });

    let referrerId = null;
    if (referredBy) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: referredBy } });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate unique random 6 char code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp,
        address,
        dob: dob ? new Date(dob) : null,
        referralCode,
        referredBy: referrerId ? referredBy : null
      },
    });

    // Add bonus points to referrer
    if (referrerId) {
      await prisma.user.update({
        where: { id: referrerId },
        data: { points: { increment: 5 } }
      });
    }

    // Link old bookings that used this whatsapp
    await prisma.booking.updateMany({
      where: { whatsapp, userId: null },
      data: { userId: user.id }
    });

    const token = await signToken({ id: user.id, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
