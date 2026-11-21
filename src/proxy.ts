import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SERVER_API_URL } from '@/lib/api';

const verifiedTokenCache = new Map<string, number>();
const inFlightAuth = new Map<string, Promise<boolean>>();
const TOKEN_CACHE_TTL_MS = 600_000; // 10 minutes

async function verifyJwtLocally(token: string, expectedLocation: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'fallback-jwt-secret-for-dev');
    if (!secret || (process.env.NODE_ENV === 'production' && secret.length < 32)) {
      return false;
    }
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, sigB64] = parts;
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;
    if (payload.location !== expectedLocation) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = Buffer.from(sigB64, 'base64url');
    const dataBytes = encoder.encode(`${headerB64}.${payloadB64}`);
    return await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes);
  } catch {
    return false;
  }
}

async function verifyToken(location: string, token: string): Promise<boolean> {
  const cacheKey = `${location}:${token}`;
  const now = Date.now();
  const cachedExpiry = verifiedTokenCache.get(cacheKey);
  if (cachedExpiry && cachedExpiry > now) {
    return true;
  }

  // Fast-path: verify JWT signature and location locally in ~0.05ms (zero network round-trip)
  if (await verifyJwtLocally(token, location)) {
    verifiedTokenCache.set(cacheKey, now + TOKEN_CACHE_TTL_MS);
    return true;
  }

  // Fallback for tokens without location claim in payload (e.g. test tokens with only { id })
  const existingPromise = inFlightAuth.get(cacheKey);
  if (existingPromise) return existingPromise;

  const authPromise = (async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/${location}/api/auth/me`, {
        headers: { cookie: `token_${location}=${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      const result = await response.json();
      const ok = response.ok && result.data?.location === location;
      if (ok) {
        verifiedTokenCache.set(cacheKey, Date.now() + TOKEN_CACHE_TTL_MS);
      }
      return ok;
    } catch {
      return false;
    } finally {
      inFlightAuth.delete(cacheKey);
    }
  })();

  inFlightAuth.set(cacheKey, authPromise);
  return authPromise;
}

function applyAdminSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return response;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === '/admin') return applyAdminSecurityHeaders(NextResponse.next());
  if (path === '/admin/login' || path === '/adminPadang/login' || path === '/adminPainan/login') {
    return applyAdminSecurityHeaders(NextResponse.redirect(new URL('/admin', request.url)));
  }
  if (path.startsWith('/admin/')) {
    return applyAdminSecurityHeaders(NextResponse.redirect(new URL(path.replace(/^\/admin/, '/adminPainan'), request.url)));
  }

  const padangToken = request.cookies.get('token_padang')?.value;
  const painanToken = request.cookies.get('token_painan')?.value;

  // Enforce strict single active branch session: reject dual cookies and force clean re-login
  if (padangToken && painanToken) {
    const res = NextResponse.redirect(new URL('/admin', request.url));
    res.cookies.delete('token_padang');
    res.cookies.delete('token_painan');
    return applyAdminSecurityHeaders(res);
  }

  const location = path.startsWith('/adminPadang') ? 'padang' : 'painan';
  const base = location === 'padang' ? '/adminPadang' : '/adminPainan';
  const token = location === 'padang' ? padangToken : painanToken;
  const authenticated = token ? await verifyToken(location, token) : false;
  if (!authenticated) {
    return applyAdminSecurityHeaders(NextResponse.redirect(new URL('/admin', request.url)));
  }
  if (
    location === 'padang' &&
    path !== base &&
    !['rooms', 'facilities', 'packages', 'contact', 'galleries', 'about', 'footer'].some(
      (page) => path === `${base}/${page}`,
    )
  ) {
    return applyAdminSecurityHeaders(NextResponse.redirect(new URL(`${base}/rooms`, request.url)));
  }
  const headers = new Headers(request.headers);
  headers.set('x-hotel-location', location);
  return applyAdminSecurityHeaders(NextResponse.next({ request: { headers } }));
}

export const config = {
  matcher: ['/admin/:path*', '/adminPadang/:path*', '/adminPainan/:path*'],
};
