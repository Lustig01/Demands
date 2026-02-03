import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject as apiCreateProject } from '../api/apiService';
import type { Project } from '../types/domain';
import type { CreateProjectPayload, PaginationParams, ProjectFilterParams } from '../api/types';

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  createProject: (payload: CreateProjectPayload) => Promise<void>;
}

export function useProjects(
  filters?: ProjectFilterParams,
  pagination?: PaginationParams
): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const params = { ...filters, ...pagination };
        const { data, meta } = await fetchProjects(params, controller.signal);
        setProjects(data);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') {
          setError(err.message ?? 'Failed to load projects');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [JSON.stringify(filters), pagination?.page, pagination?.limit, reloadTrigger]);

  const createProject = useCallback(async (payload: CreateProjectPayload) => {
    await apiCreateProject(payload);
    setReloadTrigger(prev => prev + 1);
  }, []);

  return { projects, isLoading, error, total, totalPages, createProject };
}
