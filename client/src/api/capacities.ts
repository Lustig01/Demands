import api from "../lib/axios";
import type { Capacity, CapacityCreateInput } from "./types";

export const capacitiesApi = {
  getAll: () => api.get<Capacity[]>("/capacities").then((r) => r.data),
  getById: (id: number) => api.get<Capacity>(`/capacities/${id}`).then((r) => r.data),
  getByLocation: (locationId: number) =>
    api.get<Capacity[]>(`/capacities/location/${locationId}`).then((r) => r.data),
  create: (data: CapacityCreateInput) => api.post<Capacity>("/capacities", data).then((r) => r.data),
  update: (id: number, value: number) => api.put<Capacity>(`/capacities/${id}`, { value }).then((r) => r.data),
  delete: (id: number) => api.delete(`/capacities/${id}`),
};
