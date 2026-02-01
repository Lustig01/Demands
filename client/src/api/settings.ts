import api from "../lib/axios";
import type { DecisionReason, ProjectTypeOption, SettingsInput } from "./types";

// Decision Reasons
export const decisionReasonsApi = {
  getAll: () => api.get<DecisionReason[]>("/decision-reasons").then((r) => r.data),
  create: (data: SettingsInput) => api.post<DecisionReason>("/decision-reasons", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) =>
    api.put<DecisionReason>(`/decision-reasons/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/decision-reasons/${name}`),
};

// Project Type Options
export const projectTypeOptionsApi = {
  getAll: () => api.get<ProjectTypeOption[]>("/project-type-options").then((r) => r.data),
  create: (data: SettingsInput) => api.post<ProjectTypeOption>("/project-type-options", data).then((r) => r.data),
  update: (name: string, data: SettingsInput) =>
    api.put<ProjectTypeOption>(`/project-type-options/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/project-type-options/${name}`),
};
