import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { capacitiesApi } from "../api/capacities";
import type { CapacityCreateInput } from "../api/types";

export function useCapacities() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["capacities"],
    queryFn: capacitiesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CapacityCreateInput) => capacitiesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["capacities"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: number; value: number }) => capacitiesApi.update(id, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["capacities"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => capacitiesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["capacities"] }),
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
