import prisma from "../../lib/prisma";

export const serviceService = {
  findAll: async () => {
    return prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.service.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.service.create({
      data,
    });
  },

  update: async (
    name: string,
    data: {
      name?: string;
      displayName?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) => {
    return prisma.service.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.service.delete({
      where: { name },
    });
  },
};
