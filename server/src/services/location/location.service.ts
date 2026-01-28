import prisma from "../../lib/prisma";

export const locationService = {
  findAll: async () => {
    return prisma.location.findMany();
  },

  findById: async (id: string) => {
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
    id: string,
    data: { baseName?: string; environmentName?: string; networkName?: string }
  ) => {
    return prisma.location.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.location.delete({
      where: { id },
    });
  },
};
