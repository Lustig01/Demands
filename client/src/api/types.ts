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

export interface SectionItem {
  name: string;
  displayName?: string;
  branchName: string;
  branchCenter: string;
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

export type Priority = 'P1' | 'P2' | 'P3';

export interface CreateProjectPayload {
  name: string;
  purpose: string;
  relatedTo?: string;
  type: ProjectType;
  kind: ProjectKind;
  locationId: number;
  year?: number;
  median?: Median;
  emergencyOption?: string;
  priority?: Priority;
  centerName?: string;
  branchName?: string;
  sectionName?: string;
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

export interface CreateDemandPayload {
  projectName: string;
  serviceName: string;
  resourceName: string;
  resourceService: string;
  value: number;
  locationId?: number;
  type: DemandType;
  clusterName?: string;
  centerName?: string;
  branchName?: string;
  sectionName?: string;
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
  projectType?: ProjectType;
  median?: Median;
  year?: number;
  relatedTo?: string;
  emergencyOption?: string;
  centerName?: string;
  branchName?: string;
  sectionName?: string;
}

export interface Capacity {
  id: number;
  locationId: number;
  resourceName: string;
  resourceService: string;
  value: number;
  allocated: number;
  available: number;
  location: LocationItem;
  resource: ResourceItem;
}

export interface CreateCapacityPayload {
  locationId: number;
  resourceName: string;
  resourceService: string;
  value: number;
}

export interface UpdateCapacityPayload {
  value: number;
}
