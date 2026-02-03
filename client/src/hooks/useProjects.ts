import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProjects, fetchDemands, createProject as apiCreateProject } from '../api/apiService';
import type { Project } from '../types/domain';
import type { CreateProjectPayload } from '../api/types';

interface UseProjectsResult {
  projects: Project[];
  demandCounts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  createProject: (payload: CreateProjectPayload) => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [demandCountsRaw, setDemandCountsRaw] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [projectsData, demandsData] = await Promise.all([
          fetchProjects(),
          fetchDemands(),
        ]);
        if (!cancelled) {
          setProjects(projectsData);

          const counts: Record<string, number> = {};
          for (const d of demandsData) {
            counts[d.projectName] = (counts[d.projectName] ?? 0) + 1;
          }
          setDemandCountsRaw(counts);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load projects');
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

  const demandCounts = useMemo(() => demandCountsRaw, [demandCountsRaw]);

  const createProject = useCallback(async (payload: CreateProjectPayload) => {
    const created = await apiCreateProject(payload);
    setProjects((prev) => [created, ...prev]);
  }, []);

  return { projects, demandCounts, isLoading, error, createProject };
}
