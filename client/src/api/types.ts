import type { ProjectType, ProjectKind, Median, DemandType, DemandStatus } from '../types/domain';

export interface ReferenceItem {
  name: string;
  displayName?: string;
}

export interface BranchItem {
  name: string;
  centerName: string;
  displayName?: string;
}

export interface LocationItem {
  id: number;
  baseName: string;
  environmentName: string;
  networkName: string;
}

export interface ResourceItem {
  name: string;
  unit: string;
  serviceName: string;
}

export interface CreateProjectPayload {
  name: string;
  purpose: string;
  type: ProjectType;
  kind: ProjectKind;
  locationId: number;
  year?: number;
  median?: Median;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProjectFilterParams {
  name?: string;
}

export interface DemandFilterParams {
  projectName?: string;
  serviceName?: string;
  resourceName?: string;
  resourceService?: string;
  locationId?: number;
  baseName?: string;
  environmentName?: string;
  networkName?: string;
  type?: DemandType;
  status?: DemandStatus;
}
