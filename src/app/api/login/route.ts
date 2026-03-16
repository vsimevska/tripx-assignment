import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bookingCode, ...credentials } = body;

  try {
    const res = await fetch('https://tripx-test-functions.azurewebsites.net/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      if (res.status === 400 || res.status === 401) {
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
      }

      if (res.status >= 500) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }

    const response = NextResponse.json({
      authenticated: true,
      ...(bookingCode ? { bookingCode } : {}),
    });

    response.cookies.set('authenticated', 'true', {
      httpOnly: true,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
  }
}
