import prisma from "../../lib/prisma";

export const networkService = {
  findAll: async () => {
    return prisma.network.findMany();
  },

  findByName: async (name: string) => {
    return prisma.network.findUnique({
      where: { name },
    });
  },

  create: async (name: string, displayName?: string) => {
    return prisma.network.create({
      data: { name, displayName },
    });
  },

  update: async (name: string, newName: string, displayName?: string) => {
    return prisma.network.update({
      where: { name },
      data: { name: newName, displayName },
    });
  },

  delete: async (name: string) => {
    return prisma.network.delete({
      where: { name },
    });
  },
};
