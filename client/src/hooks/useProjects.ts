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

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { ...filters, ...pagination };
      const { data, meta } = await fetchProjects(params);
      setProjects(data);
      setTotal(meta.total);
      setTotalPages(meta.totalPages);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters), pagination?.page, pagination?.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createProject = useCallback(async (payload: CreateProjectPayload) => {
    await apiCreateProject(payload);
    // Reload projects to reflect changes (or just splice if we implement that, but safer to reload due to sort/pagination)
    fetch();
  }, [fetch]);

  return { projects, isLoading, error, total, totalPages, createProject };
}
