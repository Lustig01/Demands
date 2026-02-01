import api from "../lib/axios";
import type { Project, ProjectCreateInput } from "./types";

export const projectsApi = {
  getAll: () => api.get<Project[]>("/projects").then((r) => r.data),
  getByName: (name: string) => api.get<Project>(`/projects/${name}`).then((r) => r.data),
  create: (data: ProjectCreateInput) => api.post<Project>("/projects", data).then((r) => r.data),
  update: (name: string, data: Partial<ProjectCreateInput>) =>
    api.put<Project>(`/projects/${name}`, data).then((r) => r.data),
  delete: (name: string) => api.delete(`/projects/${name}`),
};
