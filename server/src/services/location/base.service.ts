import prisma from "../../lib/prisma";

export const baseService = {
  findAll: async () => {
    return prisma.base.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.base.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.base.create({
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
    return prisma.base.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.base.delete({
      where: { name },
    });
  },
};
