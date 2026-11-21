import { API_URL } from './api';

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const hasLocationInPath = /\/(padang|painan)\/api(\/|\?|$)/.test(urlStr);
  const isAuthEndpoint = /\/api\/auth\/(login|logout)(\/|\?|$)/.test(urlStr);
  const headers = new Headers(init?.headers);
  if (
    !hasLocationInPath &&
    !isAuthEndpoint &&
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin') &&
    !headers.has('x-admin-location')
  ) {
    headers.set('x-admin-location', adminLocation(window.location.pathname));
  }
  const response = await fetch(input, { ...init, headers, credentials: 'include' });
  if (
    response.status === 401 &&
    !isAuthEndpoint &&
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/adminPadang') || window.location.pathname.startsWith('/adminPainan'))
  ) {
    window.location.replace('/admin');
  }
  return response;
}

export function adminLocation(pathname: string | null) {
  return pathname?.startsWith('/adminPadang') ? 'padang' : 'painan';
}

export function adminApi(location: string) {
  return location === 'padang' ? `${API_URL}/padang` : `${API_URL}/painan`;
}

export function adminBase(location: string) {
  return location === 'padang' ? '/adminPadang' : '/adminPainan';
}
