import prisma from "../../lib/prisma";
import { ProjectType, ProjectKind, Median } from "../../models/request/project.model";

export const projectService = {
  findAll: async () => {
    return prisma.project.findMany({
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
    }
  ) => {
    return prisma.project.update({
      where: { name },
      data,
      include: { location: true },
    });
  },

  delete: async (name: string) => {
    return prisma.project.delete({
      where: { name },
    });
  },
};
