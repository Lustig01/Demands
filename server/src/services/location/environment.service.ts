import prisma from "../../lib/prisma";

export const environmentService = {
  findAll: async () => {
    return prisma.environment.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.environment.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.environment.create({
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
    return prisma.environment.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.environment.delete({
      where: { name },
    });
  },
};
