import prisma from "../../lib/prisma";

export const projectTypeOptionService = {
  findAll: async () => {
    return prisma.projectTypeOption.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.projectTypeOption.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.projectTypeOption.create({
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
    return prisma.projectTypeOption.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.projectTypeOption.delete({
      where: { name },
    });
  },
};
