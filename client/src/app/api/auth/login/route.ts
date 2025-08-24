import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

  // Use internal URL when running inside Docker (server-to-server),
  // fall back to public URL for local dev, then localhost default.
  const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: data.message || 'Login failed' }, { status: res.status });
    }

    const token = data.token as string;
    const response = NextResponse.json({ token });

    const isHttps = req.nextUrl.protocol === 'https:';
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
