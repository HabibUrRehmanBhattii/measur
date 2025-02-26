import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function runs on the edge and doesn't support async/await for cookies()
// So we need to use the request.cookies directly in middleware
export function middleware(request: NextRequest) {
  // Don't run middleware for the new admin-login page or API routes
  if (
    request.nextUrl.pathname === '/admin-login' ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }
  
  // Check if the path is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Access cookies from the request object (doesn't need async/await)
    const authToken = request.cookies.get('admin_auth_token')?.value;
    const tokenExpiry = request.cookies.get('admin_token_expiry')?.value;
    
    // If no token or expiry, redirect to login
    if (!authToken || !tokenExpiry) {
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(tokenExpiry, 10)) {
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Allow the request to continue for non-admin routes or authenticated admin routes
  return NextResponse.next();
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};