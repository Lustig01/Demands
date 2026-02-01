import prisma from "../../lib/prisma";

export const branchService = {
  findAll: async () => {
    return prisma.branch.findMany();
  },

  findByKey: async (name: string, centerName: string) => {
    return prisma.branch.findUnique({
      where: { name_centerName: { name, centerName } },
    });
  },

  findByCenter: async (centerName: string) => {
    return prisma.branch.findMany({
      where: { centerName },
    });
  },

  create: async (name: string, centerName: string, displayName?: string) => {
    return prisma.branch.create({
      data: { name, centerName, displayName },
    });
  },

  update: async (name: string, centerName: string, newName: string, displayName?: string) => {
    return prisma.branch.update({
      where: { name_centerName: { name, centerName } },
      data: { name: newName, displayName },
    });
  },

  delete: async (name: string, centerName: string) => {
    return prisma.branch.delete({
      where: { name_centerName: { name, centerName } },
    });
  },
};
