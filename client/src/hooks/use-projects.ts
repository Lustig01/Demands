import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import type { ProjectCreateInput } from "../api/types";

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectCreateInput) => projectsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => projectsApi.delete(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
