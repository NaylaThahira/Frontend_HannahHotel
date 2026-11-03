import { defaultBranches, type HotelBranch } from './branches';

export async function getHotelBranches(): Promise<HotelBranch[]> {
  try {
    const response = await fetch('http://localhost:5000/api/branches', { cache: 'no-store' });
    return response.ok ? await response.json() : defaultBranches;
  } catch { return defaultBranches; }
}
