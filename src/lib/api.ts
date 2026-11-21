export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
export const SERVER_API_URL = (process.env.BACKEND_URL ?? API_URL).replace('://localhost:', '://127.0.0.1:');

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
}

