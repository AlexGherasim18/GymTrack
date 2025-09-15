import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for certain paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/unauthorized'
  ) {
    console.log(`🟢 MIDDLEWARE: Skipping ${pathname}`);
    return NextResponse.next();
  }

  console.log(`🔍 MIDDLEWARE: Processing ${pathname}`);
  console.log(`🔍 MIDDLEWARE: Request URL: ${req.url}`);
  console.log(`🔍 MIDDLEWARE: Headers: ${JSON.stringify(Object.fromEntries(req.headers.entries()))}`);

  try {
    console.log('🔑 MIDDLEWARE: Attempting to get token...');
    
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    console.log('🔑 MIDDLEWARE: Token result:', {
      exists: !!token,
      userId: token?.sub || token?.id,
      role: token?.role,
      name: token?.name,
      tokenKeys: token ? Object.keys(token) : []
    });

    // Check if we have a token
    if (!token) {
      console.log('❌ MIDDLEWARE: No token found - redirecting to login');
      console.log('🍪 MIDDLEWARE: Cookies:', req.cookies.getAll());
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('✅ MIDDLEWARE: Token found, checking route permissions...');

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      console.log(`🔒 MIDDLEWARE: Checking admin access for role: ${token.role}`);
      if (token.role !== 'admin') {
        console.log('❌ MIDDLEWARE: Not admin - redirecting to unauthorized');
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      console.log('✅ MIDDLEWARE: Admin access granted');
    }

    // User route protection
    if (pathname.startsWith('/user')) {
      console.log(`🔒 MIDDLEWARE: Checking user access for role: ${token.role}`);
      if (token.role !== 'user') {
        console.log('❌ MIDDLEWARE: Not user - redirecting to unauthorized');
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      console.log('✅ MIDDLEWARE: User access granted');
    }

    console.log('✅ MIDDLEWARE: Access granted, proceeding...');
    return NextResponse.next();

  } catch (error) {
    console.error('💥 MIDDLEWARE: Error occurred:', error);
    if (error instanceof Error) {
      console.error('💥 MIDDLEWARE: Error stack:', error.stack);
      console.error('💥 MIDDLEWARE: Error message:', error.message);
    }
    console.error('💥 MIDDLEWARE: Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    });
    
    // If there's an error getting the token, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}