import api from "../lib/axios";
import type { Base, Environment, Network, Location, SettingsInput } from "./types";

// Bases (Data Centers)
export const basesApi = {
  getAll: () => api.get<Base[]>("/bases").then((r) => r.data),
  create: (data: SettingsInput) => api.post<Base>("/bases", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) => api.put<Base>(`/bases/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/bases/${name}`),
};

// Environments
export const environmentsApi = {
  getAll: () => api.get<Environment[]>("/environments").then((r) => r.data),
  create: (data: SettingsInput) => api.post<Environment>("/environments", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) =>
    api.put<Environment>(`/environments/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/environments/${name}`),
};

// Networks
export const networksApi = {
  getAll: () => api.get<Network[]>("/networks").then((r) => r.data),
  create: (data: SettingsInput) => api.post<Network>("/networks", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) => api.put<Network>(`/networks/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/networks/${name}`),
};

// Locations
export const locationsApi = {
  getAll: () => api.get<Location[]>("/locations").then((r) => r.data),
  getById: (id: number) => api.get<Location>(`/locations/${id}`).then((r) => r.data),
  create: (data: { baseName: string; environmentName: string; networkName: string }) =>
    api.post<Location>("/locations", data).then((r) => r.data),
  update: (id: number, data: { baseName?: string; environmentName?: string; networkName?: string }) =>
    api.put<Location>(`/locations/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/locations/${id}`),
};
