import prisma from "../../lib/prisma";

export const serviceService = {
  findAll: async () => {
    return prisma.service.findMany();
  },

  findByName: async (name: string) => {
    return prisma.service.findUnique({
      where: { name },
    });
  },

  create: async (name: string) => {
    return prisma.service.create({
      data: { name },
    });
  },

  update: async (name: string, newName: string) => {
    return prisma.service.update({
      where: { name },
      data: { name: newName },
    });
  },

  delete: async (name: string) => {
    return prisma.service.delete({
      where: { name },
    });
  },
};
