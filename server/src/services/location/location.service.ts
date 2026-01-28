import prisma from "../../lib/prisma";

export const locationService = {
  findAll: async () => {
    return prisma.location.findMany();
  },

  findById: async (id: number) => {
    return prisma.location.findUnique({
      where: { id },
    });
  },

  findByComposite: async (
    baseName: string,
    environmentName: string,
    networkName: string
  ) => {
    return prisma.location.findUnique({
      where: {
        baseName_environmentName_networkName: { baseName, environmentName, networkName },
      },
    });
  },

  findByFilters: async (filters: {
    baseName?: string;
    environmentName?: string;
    networkName?: string;
  }) => {
    const where: {
      baseName?: string;
      environmentName?: string;
      networkName?: string;
    } = {};

    if (filters.baseName) where.baseName = filters.baseName;
    if (filters.environmentName) where.environmentName = filters.environmentName;
    if (filters.networkName) where.networkName = filters.networkName;

    return prisma.location.findMany({ where });
  },

  create: async (
    baseName: string,
    environmentName: string,
    networkName: string
  ) => {
    return prisma.location.create({
      data: { baseName, environmentName, networkName },
    });
  },

  update: async (
    id: number,
    data: { baseName?: string; environmentName?: string; networkName?: string }
  ) => {
    return prisma.location.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.location.delete({
      where: { id },
    });
  },
};
