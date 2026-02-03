import { useState, useEffect } from 'react';
import { fetchDemands } from '../api/apiService';
import type { Demand } from '../types/domain';
import type { PaginationParams, DemandFilterParams } from '../api/types';

interface UseDemandsResult {
  demands: Demand[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

export function useDemands(
  filters: DemandFilterParams,
  pagination: PaginationParams
): UseDemandsResult {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        // Only fetch if we have valid pagination (default to page 1 limit 10 if not provided, though the caller should provide it)
        const params = { ...filters, ...pagination };
        const { data, meta } = await fetchDemands(params);

        if (!cancelled) {
          setDemands(data);
          setTotal(meta.total);
          setTotalPages(meta.totalPages);
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
  }, [JSON.stringify(filters), pagination.page, pagination.limit]);

  return { demands, isLoading, error, total, totalPages };
}
