import { useState, useEffect } from 'react';
import { fetchDemands } from '../api/apiService';
import type { Demand } from '../types/domain';

interface UseDemandsResult {
  demands: Demand[];
  isLoading: boolean;
  error: string | null;
}

export function useDemands(): UseDemandsResult {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchDemands();
        if (!cancelled) {
          setDemands(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load demands');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { demands, isLoading, error };
}
