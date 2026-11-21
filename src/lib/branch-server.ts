import { SERVER_API_URL } from './api';
import { defaultBranches, type HotelBranch } from './branches';

export async function getHotelBranches(): Promise<HotelBranch[]> {
  try {
    const response = await fetch(`${SERVER_API_URL}/api/branches`, {
      next: { revalidate: 300, tags: ['branches'] }
    });
    return response.ok ? await response.json() : defaultBranches;
  } catch { return defaultBranches; }
}
