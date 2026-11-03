export const defaultPainanAttractions = [
  'Pantai Carocok', 'Bukik Langkisau', 'Pulau Cingkuak',
  'Kawasan Mandeh', 'Air terjun Bayang S', 'Jembatan Akar'
];

export function attractionsKey(location: string) {
  return location === 'padang' ? 'tourist_attractions_padang_json' : 'tourist_attractions_json';
}

export function parseAttractions(value: unknown, fallback: string[] = []): string[] {
  if (typeof value !== 'string') return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(item => typeof item === 'string') ? parsed : fallback;
  } catch { return fallback; }
}
