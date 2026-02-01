// Enums
export type ProjectType = "Emergency" | "Semiannual";
export type ProjectKind = "App" | "Track";
export type Median = "H1" | "H2";
export type DemandType = "New" | "Extension";
export type DemandStatus = "Pending" | "Approved" | "Rejected" | "PartiallyApproved";

// Settings base fields (shared by all settings entities)
interface SettingsFields {
  displayName: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Organization
export interface Center extends SettingsFields {
  name: string;
}

export interface Branch extends SettingsFields {
  name: string;
  centerName: string;
}

export interface Section extends SettingsFields {
  name: string;
  branchName: string;
  branchCenter: string;
}

// Location
export interface Base extends SettingsFields {
  name: string;
}

export interface Environment extends SettingsFields {
  name: string;
}

export interface Network extends SettingsFields {
  name: string;
}

export interface Location {
  id: number;
  baseName: string;
  environmentName: string;
  networkName: string;
  createdAt: string;
  updatedAt: string;
}

// Services
export interface Service extends SettingsFields {
  name: string;
}

export interface Resource extends SettingsFields {
  name: string;
  unit: string;
  serviceName: string;
}

export interface Capacity {
  id: number;
  locationId: number;
  resourceName: string;
  resourceService: string;
  value: number;
  allocated: number;
  available: number;
  location?: Location;
  resource?: Resource;
  createdAt: string;
  updatedAt: string;
}

// Requests
export interface Project {
  name: string;
  purpose: string;
  type: ProjectType;
  kind: ProjectKind;
  locationId: number;
  location?: Location;
  year: number | null;
  median: Median | null;
  createdAt: string;
  updatedAt: string;
}

export interface Demand {
  id: number;
  projectName: string;
  project?: Project;
  serviceName: string;
  service?: Service;
  resourceName: string;
  resourceService: string;
  resource?: Resource;
  value: number;
  locationId: number;
  location?: Location;
  type: DemandType;
  status: DemandStatus;
  clusterName: string | null;
  approvedValue: number | null;
  approvedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// Settings lookup models
export interface DecisionReason extends SettingsFields {
  name: string;
}

export interface ProjectTypeOption extends SettingsFields {
  name: string;
}

// API input types
export interface SettingsInput {
  name: string;
  displayName?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface DemandCreateInput {
  projectName: string;
  serviceName: string;
  resourceName: string;
  resourceService: string;
  value: number;
  locationId: number;
  type: DemandType;
  clusterName?: string;
}

export interface DemandUpdateInput {
  serviceName?: string;
  resourceName?: string;
  resourceService?: string;
  value?: number;
  locationId?: number;
  type?: DemandType;
  clusterName?: string;
}

export interface DemandApproveInput {
  status: "Approved" | "PartiallyApproved";
  approvedValue?: number;
}

export interface DemandFilters {
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

export interface ProjectCreateInput {
  name: string;
  purpose: string;
  type: ProjectType;
  kind: ProjectKind;
  locationId: number;
  year?: number;
  median?: Median;
}

export interface CapacityCreateInput {
  locationId: number;
  resourceName: string;
  resourceService: string;
  value: number;
}
