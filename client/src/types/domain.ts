export type ProjectType = 'Semiannual' | 'Emergency';
export type ProjectKind = string;
export type Median = 'H1' | 'H2';
export type DemandType = 'New' | 'Extension';
export type DemandStatus = 'Pending' | 'Approved' | 'Rejected' | 'PartiallyApproved';

export interface Project {
  name: string;
  purpose: string;
  type: ProjectType;
  kind: ProjectKind;
  locationId: number;
  year?: number;
  median?: Median;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  demandCount?: number;
}

export interface DemandLocation {
  base: string;
  environment: string;
  network: string;
}

export interface Demand {
  id: number;
  projectName: string;
  serviceName: string;
  resourceName: string;
  resourceService: string;
  unit: string;
  value: number;
  type: DemandType;
  location: DemandLocation;
  status: DemandStatus;
  clusterName?: string;
  approvedValue?: number;
  approvedDate?: string;
  decisionReasonName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}
