import prisma from "../../lib/prisma";

export const environmentService = {
  findAll: async () => {
    return prisma.environment.findMany();
  },

  findByName: async (name: string) => {
    return prisma.environment.findUnique({
      where: { name },
    });
  },

  create: async (name: string, displayName?: string) => {
    return prisma.environment.create({
      data: { name, displayName },
    });
  },

  update: async (name: string, newName: string, displayName?: string) => {
    return prisma.environment.update({
      where: { name },
      data: { name: newName, displayName },
    });
  },

  delete: async (name: string) => {
    return prisma.environment.delete({
      where: { name },
    });
  },
};
