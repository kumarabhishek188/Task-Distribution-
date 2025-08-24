import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect these routes: require a token cookie
const PROTECTED_PATHS = ['/dashboard', '/upload', '/tasks'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (token) return NextResponse.next();

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/tasks/:path*'],
};
