import prisma from "../../lib/prisma";
import { DemandType, DemandStatus } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";

export const demandService = {
  findAll: async (
    createdBy?: string,
    pagination?: { page: number; limit: number }
  ) => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.demand.findMany({
        where: createdBy ? { createdBy } : undefined,
        include: {
          project: true,
          service: true,
          resource: true,
          location: true,
        },
        skip,
        take: limit,
      }),
      prisma.demand.count({
        where: createdBy ? { createdBy } : undefined,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  findByFilters: async (
    filters: {
      projectName?: string;
      resourceName?: string;
      resourceService?: string;
      locationId?: number;
      baseName?: string;
      environmentName?: string;
      networkName?: string;
      type?: DemandType;
      status?: DemandStatus;
      createdBy?: string;
    },
    pagination?: { page: number; limit: number }
  ) => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: {
      projectName?: string;
      resourceName?: string;
      resourceService?: string;
      locationId?: number;
      type?: DemandType;
      status?: DemandStatus;
      createdBy?: string;
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
    if (filters.createdBy) where.createdBy = filters.createdBy;

    if (filters.baseName || filters.environmentName || filters.networkName) {
      where.location = {};
      if (filters.baseName) where.location.baseName = filters.baseName;
      if (filters.environmentName) where.location.environmentName = filters.environmentName;
      if (filters.networkName) where.location.networkName = filters.networkName;
    }

    const [data, total] = await Promise.all([
      prisma.demand.findMany({
        where,
        include: {
          project: true,
          service: true,
          resource: true,
          location: true,
        },
        skip,
        take: limit,
      }),
      prisma.demand.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    createdBy?: string;
    createdByName?: string;
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
    },
    createdBy?: string
  ) => {
    if (createdBy) {
      const existing = await prisma.demand.findFirst({
        where: { id, createdBy },
      });
      if (!existing) {
        throw new NotFoundError("Demand");
      }
    }
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

  delete: async (id: number, createdBy?: string) => {
    if (createdBy) {
      const existing = await prisma.demand.findFirst({
        where: { id, createdBy },
      });
      if (!existing) {
        throw new NotFoundError("Demand");
      }
    }
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
