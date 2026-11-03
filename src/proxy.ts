import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === '/admin') return NextResponse.next();
  if (path === '/admin/login' || path === '/adminPadang/login' || path === '/adminPainan/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (path.startsWith('/admin/')) {
    return NextResponse.redirect(new URL(path.replace(/^\/admin/, '/adminPainan'), request.url));
  }
  const location = path.startsWith('/adminPadang') ? 'padang' : 'painan';
  const base = location === 'padang' ? '/adminPadang' : '/adminPainan';
  const token = request.cookies.get(`token_${location}`)?.value;
  let authenticated = false;
  if (token) {
    try {
      const response = await fetch(`http://localhost:${location === 'padang' ? 5001 : 5000}/api/auth/me`, {
        headers: { cookie: `token_${location}=${token}` }, cache: 'no-store', signal: AbortSignal.timeout(5000)
      });
      const result = await response.json();
      authenticated = response.ok && result.data?.location === location;
    } catch { authenticated = false; }
  }
  if (!authenticated) return NextResponse.redirect(new URL("/admin", request.url));
  if (location === 'padang' && path !== base && !['rooms', 'facilities', 'packages', 'contact'].some(page => path === `${base}/${page}`)) {
    return NextResponse.redirect(new URL(`${base}/rooms`, request.url));
  }
  const headers = new Headers(request.headers);
  headers.set('x-hotel-location', location);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/admin/:path*', '/adminPadang/:path*', '/adminPainan/:path*'] };
