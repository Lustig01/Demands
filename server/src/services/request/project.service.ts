import prisma from "../../lib/prisma";
import { ProjectType, Median } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";

export const projectService = {
  findAll: async (
    createdBy?: string,
    pagination?: { page: number; limit: number }
  ) => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where: createdBy ? { createdBy } : undefined,
        include: {
          location: true,
          kind: true,
          emergencyOption: true,
          _count: {
            select: { demands: true },
          },
        },
        skip,
        take: limit,
      }),
      prisma.project.count({
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

  findByFilters: async (
    filters: { name?: string; createdBy?: string },
    pagination?: { page: number; limit: number }
  ) => {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }
    if (filters.createdBy) {
      where.createdBy = filters.createdBy;
    }

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          location: true,
          kind: true,
          emergencyOption: true,
          _count: {
            select: { demands: true },
          },
        },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
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

  findByName: async (name: string) => {
    return prisma.project.findUnique({
      where: { name },
      include: {
        location: true,
        kind: true,
        emergencyOption: true,
        demands: true,
        _count: {
          select: { demands: true },
        },
      },
    });
  },

  create: async (data: {
    name: string;
    purpose: string;
    relatedTo?: string;
    type: ProjectType;
    kindName: string;
    locationId: number;
    year?: number;
    median?: Median;
    emergencyOptionName?: string;
    centerName: string;
    branchName: string;
    sectionName: string;
    createdBy?: string;
    createdByName?: string;
  }) => {
    return prisma.project.create({
      data,
      include: { location: true, kind: true, emergencyOption: true },
    });
  },

  update: async (
    name: string,
    data: {
      purpose?: string;
      relatedTo?: string | null;
      type?: ProjectType;
      kindName?: string;
      locationId?: number;
      year?: number | null;
      median?: Median | null;
      emergencyOptionName?: string | null;
      centerName?: string;
      branchName?: string;
      sectionName?: string;
    },
    createdBy?: string
  ) => {
    if (createdBy) {
      const existing = await prisma.project.findFirst({
        where: { name, createdBy },
      });
      if (!existing) {
        throw new NotFoundError("Project");
      }
    }
    return prisma.project.update({
      where: { name },
      data,
      include: { location: true, kind: true, emergencyOption: true },
    });
  },

  delete: async (name: string, createdBy?: string) => {
    const existing = await prisma.project.findFirst({
      where: createdBy ? { name, createdBy } : { name },
    });
    if (!existing) {
      throw new NotFoundError("Project");
    }

    const demandCount = await prisma.demand.count({
      where: { projectName: name },
    });
    if (demandCount > 0) {
      throw new Error("Cannot delete project with existing demands");
    }

    return prisma.project.delete({
      where: { name },
    });
  },
};
