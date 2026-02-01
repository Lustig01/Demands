import api from "../lib/axios";
import type { Demand, DemandCreateInput, DemandUpdateInput, DemandApproveInput, DemandFilters } from "./types";

export const demandsApi = {
  getAll: () => api.get<Demand[]>("/demands").then((r) => r.data),
  getById: (id: number) => api.get<Demand>(`/demands/${id}`).then((r) => r.data),
  getByFilters: (filters: DemandFilters) =>
    api.get<Demand[]>("/demands/filter", { params: filters }).then((r) => r.data),
  create: (data: DemandCreateInput) => api.post<Demand>("/demands", data).then((r) => r.data),
  update: (id: number, data: DemandUpdateInput) => api.patch<Demand>(`/demands/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/demands/${id}`),
  approve: (id: number, data: DemandApproveInput) => api.patch<Demand>(`/demands/${id}/approve`, data).then((r) => r.data),
  reject: (id: number) => api.patch<Demand>(`/demands/${id}/reject`).then((r) => r.data),
};
