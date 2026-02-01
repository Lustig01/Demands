import api from "../lib/axios";
import type { Center, Branch, Section, SettingsInput } from "./types";

// Centers
export const centersApi = {
  getAll: () => api.get<Center[]>("/centers").then((r) => r.data),
  create: (data: SettingsInput) => api.post<Center>("/centers", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) => api.put<Center>(`/centers/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/centers/${name}`),
};

// Branches
export const branchesApi = {
  getAll: () => api.get<Branch[]>("/branches").then((r) => r.data),
  create: (data: SettingsInput & { centerName: string }) => api.post<Branch>("/branches", data).then((r) => r.data),
  update: (name: string, centerName: string, data: SettingsInput) =>
    api.put<Branch>(`/branches/${name}/${centerName}`, data).then((r) => r.data),
  delete: (name: string, centerName: string) => api.delete(`/branches/${name}/${centerName}`),
};

// Sections
export const sectionsApi = {
  getAll: () => api.get<Section[]>("/sections").then((r) => r.data),
  create: (data: SettingsInput & { branchName: string; branchCenter: string }) =>
    api.post<Section>("/sections", data).then((r) => r.data),
  update: (name: string, branchName: string, centerName: string, data: SettingsInput) =>
    api.put<Section>(`/sections/${name}/${branchName}/${centerName}`, data).then((r) => r.data),
  delete: (name: string, branchName: string, centerName: string) =>
    api.delete(`/sections/${name}/${branchName}/${centerName}`),
};
