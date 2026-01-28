import prisma from "../lib/prisma";

export const networkService = {
  findAll: async () => {
    return prisma.network.findMany();
  },

  findByName: async (name: string) => {
    return prisma.network.findUnique({
      where: { name },
    });
  },

  create: async (name: string) => {
    return prisma.network.create({
      data: { name },
    });
  },

  update: async (name: string, newName: string) => {
    return prisma.network.update({
      where: { name },
      data: { name: newName },
    });
  },

  delete: async (name: string) => {
    return prisma.network.delete({
      where: { name },
    });
  },
};
