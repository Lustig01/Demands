import prisma from "../../lib/prisma";

export const resourceService = {
  findAll: async () => {
    return prisma.resource.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByKey: async (name: string, serviceName: string) => {
    return prisma.resource.findUnique({
      where: { name_serviceName: { name, serviceName } },
    });
  },

  findByService: async (serviceName: string) => {
    return prisma.resource.findMany({
      where: { serviceName },
      orderBy: { sortOrder: "asc" },
    });
  },

  create: async (data: {
    name: string;
    unit: string;
    serviceName: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.resource.create({
      data,
    });
  },

  update: async (
    name: string,
    serviceName: string,
    data: {
      name?: string;
      unit?: string;
      displayName?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) => {
    return prisma.resource.update({
      where: { name_serviceName: { name, serviceName } },
      data,
    });
  },

  delete: async (name: string, serviceName: string) => {
    return prisma.resource.delete({
      where: { name_serviceName: { name, serviceName } },
    });
  },
};
