import { useState, useEffect, useCallback } from 'react';
import { fetchDemands, createDemand as apiCreateDemand } from '../api/apiService';
import type { Demand } from '../types/domain';
import type { PaginationParams, DemandFilterParams, CreateDemandPayload } from '../api/types';

interface UseDemandsResult {
  demands: Demand[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  createDemand: (payload: CreateDemandPayload) => Promise<void>;
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
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params = { ...filters, ...pagination };
        const { data, meta } = await fetchDemands(params, controller.signal);

        setDemands(data);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') {
          setError(err.message ?? 'Failed to load demands');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { controller.abort(); };
  }, [JSON.stringify(filters), pagination.page, pagination.limit, reloadTrigger]);

  const createDemand = useCallback(async (payload: CreateDemandPayload) => {
    await apiCreateDemand(payload);
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return { demands, isLoading, error, total, totalPages, createDemand };
}
