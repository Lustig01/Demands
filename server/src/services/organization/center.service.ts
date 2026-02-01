import prisma from "../../lib/prisma";

export const centerService = {
  findAll: async () => {
    return prisma.center.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.center.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.center.create({
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
    return prisma.center.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.center.delete({
      where: { name },
    });
  },
};
