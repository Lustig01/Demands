import prisma from "../../lib/prisma";

export const capacityService = {
  findAll: async () => {
    return prisma.capacity.findMany();
  },

  findById: async (id: number) => {
    return prisma.capacity.findUnique({
      where: { id },
    });
  },

  findByLocation: async (locationId: number) => {
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
    locationId: number,
    resourceName: string,
    resourceService: string,
    value: number
  ) => {
    return prisma.capacity.create({
      data: { locationId, resourceName, resourceService, value },
    });
  },

  update: async (id: number, value: number) => {
    return prisma.capacity.update({
      where: { id },
      data: { value },
    });
  },

  delete: async (id: number) => {
    return prisma.capacity.delete({
      where: { id },
    });
  },
};
