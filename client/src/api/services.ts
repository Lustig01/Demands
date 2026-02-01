import api from "../lib/axios";
import type { Service, Resource, SettingsInput } from "./types";

// Services
export const servicesApi = {
  getAll: () => api.get<Service[]>("/services").then((r) => r.data),
  create: (data: SettingsInput) => api.post<Service>("/services", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) => api.put<Service>(`/services/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/services/${name}`),
};

// Resources
export const resourcesApi = {
  getAll: () => api.get<Resource[]>("/resources").then((r) => r.data),
  getByService: (serviceName: string) => api.get<Resource[]>(`/resources/${serviceName}`).then((r) => r.data),
  create: (data: SettingsInput & { unit: string; serviceName: string }) =>
    api.post<Resource>("/resources", data).then((r) => r.data),
  update: (serviceName: string, resourceName: string, data: SettingsInput & { unit?: string }) =>
    api.put<Resource>(`/resources/${serviceName}/${resourceName}`, data).then((r) => r.data),
  delete: (serviceName: string, resourceName: string) => api.delete(`/resources/${serviceName}/${resourceName}`),
};
