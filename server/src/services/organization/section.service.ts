import prisma from "../../lib/prisma";

export const sectionService = {
  findAll: async () => {
    return prisma.section.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByKey: async (name: string, branchName: string, branchCenter: string) => {
    return prisma.section.findUnique({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
    });
  },

  findByBranch: async (branchName: string, branchCenter: string) => {
    return prisma.section.findMany({
      where: { branchName, branchCenter },
      orderBy: { sortOrder: "asc" },
    });
  },

  create: async (data: {
    name: string;
    branchName: string;
    branchCenter: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.section.create({
      data,
    });
  },

  update: async (
    name: string,
    branchName: string,
    branchCenter: string,
    data: {
      name?: string;
      displayName?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) => {
    return prisma.section.update({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
      data,
    });
  },

  delete: async (name: string, branchName: string, branchCenter: string) => {
    return prisma.section.delete({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
    });
  },
};
