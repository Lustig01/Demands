export type ProjectType = 'Semiannual' | 'Emergency';
export type ProjectKind = string;
export type Median = 'H1' | 'H2';
export type Priority = 'P1' | 'P2' | 'P3';
export type DemandType = 'New' | 'Extension';
export type DemandStatus = 'Pending' | 'Approved' | 'Rejected' | 'PartiallyApproved';

export interface Project {
  name: string;
  purpose: string;
  relatedTo?: string;
  type: ProjectType;
  kind: ProjectKind;
  location: DemandLocation;
  year?: number;
  median?: Median;
  priority?: Priority;
  emergencyOption?: string;
  centerName?: string;
  branchName?: string;
  sectionName?: string;
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
  centerName?: string;
  branchName?: string;
  sectionName?: string;
}
