import { useState, useEffect } from 'react';
import { getDestinations } from '@/src/services/destinations';
import { Destination } from '@/src/types/destination';

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setError('Failed to load destinations'))
      .finally(() => setLoading(false));
  }, []);

  return { destinations, loading, error };
}
