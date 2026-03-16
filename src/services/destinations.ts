import { Destination } from '@/src/types/destination';

export async function getDestinations(): Promise<Destination[]> {
  const res = await fetch('/api/destinations');

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch destinations');
  }

  return data;
}
