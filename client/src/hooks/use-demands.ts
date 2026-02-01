import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demandsApi } from "../api/demands";
import type { DemandCreateInput, DemandUpdateInput, DemandApproveInput, DemandFilters } from "../api/types";

export function useDemands(filters?: DemandFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["demands", filters],
    queryFn: () => (filters ? demandsApi.getByFilters(filters) : demandsApi.getAll()),
  });

  const createMutation = useMutation({
    mutationFn: (data: DemandCreateInput) => demandsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demands"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DemandUpdateInput }) => demandsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demands"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => demandsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demands"] }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DemandApproveInput }) => demandsApi.approve(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demands"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => demandsApi.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demands"] }),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    approve: approveMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
  };
}
