import api from './axiosInstance';
import type { Demand, Project } from '../types/domain';
import type {
  ReferenceItem,
  BranchItem,
  LocationItem,
  ResourceItem,
  CreateProjectPayload,
} from './types';

// --- Response mappers ---

function mapDemand(raw: any): Demand {
  return {
    id: raw.id,
    projectName: raw.projectName,
    serviceName: raw.serviceName,
    resourceName: raw.resourceName,
    resourceService: raw.resourceService,
    unit: raw.resource?.unit ?? '',
    value: raw.value,
    type: raw.type,
    location: {
      base: raw.location?.baseName ?? '',
      environment: raw.location?.environmentName ?? '',
      network: raw.location?.networkName ?? '',
    },
    status: raw.status,
    clusterName: raw.clusterName,
    approvedValue: raw.approvedValue,
    approvedDate: raw.approvedDate,
    decisionReasonName: raw.decisionReasonName,
    createdBy: raw.createdBy ?? '',
    createdByName: raw.createdByName ?? '',
    createdAt: raw.createdAt,
  };
}

function mapProject(raw: any): Project {
  return {
    name: raw.name,
    purpose: raw.purpose,
    type: raw.type,
    kind: raw.kind,
    locationId: raw.locationId,
    year: raw.year ?? undefined,
    median: raw.median ?? undefined,
    createdBy: raw.createdBy ?? '',
    createdByName: raw.createdByName ?? '',
    createdAt: raw.createdAt,
  };
}

// --- Projects ---

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get('/projects');
  return data.map(mapProject);
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post('/projects', payload);
  return mapProject(data);
}

// --- Demands ---

export async function fetchDemands(): Promise<Demand[]> {
  const { data } = await api.get('/demands');
  return data.map(mapDemand);
}

// --- Reference data ---

export async function fetchBases(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/bases');
  return data;
}

export async function fetchEnvironments(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/environments');
  return data;
}

export async function fetchNetworks(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/networks');
  return data;
}

export async function fetchCenters(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/centers');
  return data;
}

export async function fetchBranches(): Promise<BranchItem[]> {
  const { data } = await api.get('/branches');
  return data;
}

export async function fetchLocations(): Promise<LocationItem[]> {
  const { data } = await api.get('/locations');
  return data;
}

export async function fetchServices(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/services');
  return data;
}

export async function fetchResources(): Promise<ResourceItem[]> {
  const { data } = await api.get('/resources');
  return data;
}
