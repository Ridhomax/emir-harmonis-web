import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { id: true, name: true, email: true, whatsapp: true, role: true, points: true, referralCode: true }
  });
  return NextResponse.json({ user });
}
