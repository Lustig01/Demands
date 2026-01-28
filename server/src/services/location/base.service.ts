import prisma from "../../lib/prisma";

export const baseService = {
  findAll: async () => {
    return prisma.base.findMany();
  },

  findByName: async (name: string) => {
    return prisma.base.findUnique({
      where: { name },
    });
  },

  create: async (name: string) => {
    return prisma.base.create({
      data: { name },
    });
  },

  update: async (name: string, newName: string) => {
    return prisma.base.update({
      where: { name },
      data: { name: newName },
    });
  },

  delete: async (name: string) => {
    return prisma.base.delete({
      where: { name },
    });
  },
};
