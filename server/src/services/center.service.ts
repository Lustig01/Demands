import prisma from "../lib/prisma";

export const centerService = {
  findAll: async () => {
    return prisma.center.findMany();
  },

  findByName: async (name: string) => {
    return prisma.center.findUnique({
      where: { name },
    });
  },

  create: async (name: string) => {
    return prisma.center.create({
      data: { name },
    });
  },

  update: async (name: string, newName: string) => {
    return prisma.center.update({
      where: { name },
      data: { name: newName },
    });
  },

  delete: async (name: string) => {
    return prisma.center.delete({
      where: { name },
    });
  },
};
