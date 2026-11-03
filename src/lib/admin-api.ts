export function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, { ...init, credentials: 'include' });
}

export function adminLocation(pathname: string | null) {
  return pathname?.startsWith('/adminPadang') ? 'padang' : 'painan';
}

export function adminApi(location: string) {
  return location === 'padang' ? 'http://localhost:5001' : 'http://localhost:5000';
}

export function adminBase(location: string) {
  return location === 'padang' ? '/adminPadang' : '/adminPainan';
}
