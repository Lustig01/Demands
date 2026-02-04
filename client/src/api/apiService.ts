import api from './axiosInstance';
import type { Demand, Project } from '../types/domain';

import type {
  ReferenceItem,
  BranchItem,
  SectionItem,
  LocationItem,
  ResourceItem,
  CreateProjectPayload,
  CreateDemandPayload,
  PaginationParams,
  PaginatedResponse,
  ProjectFilterParams,
  DemandFilterParams,
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
    relatedTo: raw.relatedTo ?? undefined,
    type: raw.type,
    kind: raw.kindName ?? raw.kind,
    location: {
      base: raw.location?.baseName ?? '',
      environment: raw.location?.environmentName ?? '',
      network: raw.location?.networkName ?? '',
    },
    year: raw.year ?? undefined,
    median: raw.median ?? undefined,
    createdBy: raw.createdBy ?? '',
    createdByName: raw.createdByName ?? '',
    createdAt: raw.createdAt,
    demandCount: raw._count?.demands ?? 0,
  };
}

// --- Projects ---

export async function fetchProjects(
  params?: PaginationParams & ProjectFilterParams,
  signal?: AbortSignal
): Promise<PaginatedResponse<Project>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.name) query.append('name', params.name);

  // If filtering by name, use /projects/filter, otherwise /projects
  const endpoint = params?.name ? '/projects/filter' : '/projects';

  const { data } = await api.get(`${endpoint}?${query.toString()}`, { signal });
  return {
    data: data.data.map(mapProject),
    meta: data.meta,
  };
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post('/projects', payload);
  return mapProject(data);
}

// --- Demands ---

export async function fetchDemands(
  params?: PaginationParams & DemandFilterParams,
  signal?: AbortSignal
): Promise<PaginatedResponse<Demand>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  if (params) {
    if (params.projectName) query.append('project', params.projectName);

    // Map serviceName to resourceService, taking precedence over explicit resourceService filter
    if (params.serviceName) {
      query.append('resourceService', params.serviceName);
    } else if (params.resourceService) {
      query.append('resourceService', params.resourceService);
    }

    if (params.resourceName) query.append('resource', params.resourceName);
    if (params.locationId) query.append('location', params.locationId.toString());
    if (params.baseName) query.append('base', params.baseName);
    if (params.environmentName) query.append('environment', params.environmentName);
    if (params.networkName) query.append('network', params.networkName);
    if (params.type) query.append('type', params.type);
    if (params.status) query.append('status', params.status);
    if (params.projectType) query.append('projectType', params.projectType);
    if (params.median) query.append('median', params.median);
    if (params.year) query.append('year', params.year.toString());
    if (params.relatedTo) query.append('relatedTo', params.relatedTo);
  }

  // If any filter is present (besides pagination), use /demands/filter, otherwise /demands
  const isFiltering = params && (
    params.projectName || params.serviceName || params.resourceName || params.resourceService ||
    params.locationId || params.baseName || params.environmentName ||
    params.networkName || params.type || params.status ||
    params.projectType || params.median || params.year || params.relatedTo
  );

  const endpoint = isFiltering ? '/demands/filter' : '/demands';

  const { data } = await api.get(`${endpoint}?${query.toString()}`, { signal });
  return {
    data: data.data.map(mapDemand),
    meta: data.meta,
  };
}

export async function createDemand(payload: CreateDemandPayload): Promise<Demand> {
  const { data } = await api.post('/demands', payload);
  return mapDemand(data);
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

export async function fetchSections(): Promise<SectionItem[]> {
  const { data } = await api.get('/sections');
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

export async function fetchProjectKinds(): Promise<ReferenceItem[]> {
  const { data } = await api.get('/project-kinds');
  return data;
}
