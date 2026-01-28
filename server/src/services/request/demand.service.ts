import prisma from "../../lib/prisma";
import { DemandType, DemandStatus } from "@prisma/client";

export const demandService = {
  findAll: async () => {
    return prisma.demand.findMany({
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  findById: async (id: number) => {
    return prisma.demand.findUnique({
      where: { id },
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  findByFilters: async (filters: {
    projectName?: string;
    resourceName?: string;
    resourceService?: string;
    locationId?: number;
    baseName?: string;
    environmentName?: string;
    networkName?: string;
    type?: DemandType;
    status?: DemandStatus;
  }) => {
    const where: {
      projectName?: string;
      resourceName?: string;
      resourceService?: string;
      locationId?: number;
      type?: DemandType;
      status?: DemandStatus;
      location?: {
        baseName?: string;
        environmentName?: string;
        networkName?: string;
      };
    } = {};

    if (filters.projectName) where.projectName = filters.projectName;
    if (filters.resourceName) where.resourceName = filters.resourceName;
    if (filters.resourceService) where.resourceService = filters.resourceService;
    if (filters.locationId) where.locationId = filters.locationId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;

    if (filters.baseName || filters.environmentName || filters.networkName) {
      where.location = {};
      if (filters.baseName) where.location.baseName = filters.baseName;
      if (filters.environmentName) where.location.environmentName = filters.environmentName;
      if (filters.networkName) where.location.networkName = filters.networkName;
    }

    return prisma.demand.findMany({
      where,
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  create: async (data: {
    projectName: string;
    serviceName: string;
    resourceName: string;
    resourceService: string;
    value: number;
    locationId: number;
    type: DemandType;
    clusterName?: string;
  }) => {
    return prisma.demand.create({
      data: {
        ...data,
        status: "Pending",
      },
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  update: async (
    id: number,
    data: {
      serviceName?: string;
      resourceName?: string;
      resourceService?: string;
      value?: number;
      locationId?: number;
      type?: DemandType;
      clusterName?: string;
    }
  ) => {
    return prisma.demand.update({
      where: { id },
      data,
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  delete: async (id: number) => {
    return prisma.demand.delete({
      where: { id },
    });
  },

  reject: async (id: number) => {
    return prisma.demand.update({
      where: { id },
      data: {
        status: "Rejected",
      },
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },

  approve: async (
    id: number,
    data: {
      status: "Approved" | "PartiallyApproved";
      approvedValue?: number;
    }
  ) => {
    return prisma.demand.update({
      where: { id },
      data: {
        status: data.status,
        approvedValue: data.approvedValue,
        approvedDate: new Date(),
      },
      include: {
        project: true,
        service: true,
        resource: true,
        location: true,
      },
    });
  },
};
