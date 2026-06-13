import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  let decodedToken: any = null;
  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET || "super-secret-key-emir-harmonis-123!";
      const key = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
      decodedToken = payload;
    } catch (e) {
      decodedToken = null;
    }
  }

  // Lindungi route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!decodedToken || decodedToken.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Lindungi route /user
  if (request.nextUrl.pathname.startsWith('/user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Jika sudah login, cegah akses ke halaman login
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/user', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/login'],
}
