import prisma from "../../lib/prisma";
import { ProjectType, ProjectKind, Median } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";

export const projectService = {
  findAll: async (createdBy?: string) => {
    return prisma.project.findMany({
      where: createdBy ? { createdBy } : undefined,
      include: { location: true },
    });
  },

  findByName: async (name: string) => {
    return prisma.project.findUnique({
      where: { name },
      include: { location: true, demands: true },
    });
  },

  create: async (data: {
    name: string;
    purpose: string;
    type: ProjectType;
    kind: ProjectKind;
    locationId: number;
    year?: number;
    median?: Median;
    createdBy?: string;
    createdByName?: string;
  }) => {
    return prisma.project.create({
      data,
      include: { location: true },
    });
  },

  update: async (
    name: string,
    data: {
      purpose?: string;
      type?: ProjectType;
      kind?: ProjectKind;
      locationId?: number;
      year?: number | null;
      median?: Median | null;
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
      include: { location: true },
    });
  },

  delete: async (name: string, createdBy?: string) => {
    if (createdBy) {
      const existing = await prisma.project.findFirst({
        where: { name, createdBy },
      });
      if (!existing) {
        throw new NotFoundError("Project");
      }
    }
    return prisma.project.delete({
      where: { name },
    });
  },
};
