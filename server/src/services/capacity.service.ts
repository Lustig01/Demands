import prisma from "../lib/prisma";

export const capacityService = {
  findAll: async () => {
    return prisma.capacity.findMany();
  },

  findById: async (id: string) => {
    return prisma.capacity.findUnique({
      where: { id },
    });
  },

  findByLocation: async (locationId: string) => {
    return prisma.capacity.findMany({
      where: { locationId },
    });
  },

  findByResource: async (resourceName: string, resourceService: string) => {
    return prisma.capacity.findMany({
      where: { resourceName, resourceService },
    });
  },

  create: async (
    locationId: string,
    resourceName: string,
    resourceService: string,
    value: number
  ) => {
    return prisma.capacity.create({
      data: { locationId, resourceName, resourceService, value },
    });
  },

  update: async (id: string, value: number) => {
    return prisma.capacity.update({
      where: { id },
      data: { value },
    });
  },

  delete: async (id: string) => {
    return prisma.capacity.delete({
      where: { id },
    });
  },
};
