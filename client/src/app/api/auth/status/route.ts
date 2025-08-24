import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  const hasToken = !!store.get('token')?.value;
  return NextResponse.json({ authed: hasToken });
}
