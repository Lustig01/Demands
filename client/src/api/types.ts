import type { ProjectType, ProjectKind, Median } from '../types/domain';

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
