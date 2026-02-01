import prisma from "../../lib/prisma";

export const networkService = {
  findAll: async () => {
    return prisma.network.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.network.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.network.create({
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
    return prisma.network.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.network.delete({
      where: { name },
    });
  },
};
