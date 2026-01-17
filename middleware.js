import { NextResponse } from 'next/server';

export function middleware(request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect');

  if (redirectUrl) {
    try {
      // Basic validation: ensure it's a valid URL or a relative path
      new URL(redirectUrl, request.url);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch (e) {
      console.error("Invalid redirect URL in middleware:", redirectUrl);
    }
  }

  return NextResponse.next();
}

// Optional: Configure which paths the middleware should run on
export const config = {
  matcher: '/:path*',
};
