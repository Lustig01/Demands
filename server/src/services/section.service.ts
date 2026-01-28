import prisma from "../lib/prisma";

export const sectionService = {
  findAll: async () => {
    return prisma.section.findMany();
  },

  findByKey: async (name: string, branchName: string, branchCenter: string) => {
    return prisma.section.findUnique({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
    });
  },

  findByBranch: async (branchName: string, branchCenter: string) => {
    return prisma.section.findMany({
      where: { branchName, branchCenter },
    });
  },

  create: async (name: string, branchName: string, branchCenter: string) => {
    return prisma.section.create({
      data: { name, branchName, branchCenter },
    });
  },

  update: async (
    name: string,
    branchName: string,
    branchCenter: string,
    newName: string
  ) => {
    return prisma.section.update({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
      data: { name: newName },
    });
  },

  delete: async (name: string, branchName: string, branchCenter: string) => {
    return prisma.section.delete({
      where: { name_branchName_branchCenter: { name, branchName, branchCenter } },
    });
  },
};
