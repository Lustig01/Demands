import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SettingsInput } from "../api/types";

interface SettingsApi<T> {
  getAll: () => Promise<T[]>;
  create: (data: SettingsInput) => Promise<T>;
  update: (name: string, data: SettingsInput) => Promise<T>;
  delete: (name: string) => Promise<unknown>;
}

export function useSettingsQuery<T>(key: string, api: SettingsApi<T>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [key],
    queryFn: api.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: SettingsInput) => api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ name, data }: { name: string; data: SettingsInput }) => api.update(name, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => api.delete(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
