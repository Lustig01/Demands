import prisma from "../../lib/prisma";

export const decisionReasonService = {
  findAll: async () => {
    return prisma.decisionReason.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },

  findByName: async (name: string) => {
    return prisma.decisionReason.findUnique({
      where: { name },
    });
  },

  create: async (data: {
    name: string;
    displayName?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.decisionReason.create({
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
    return prisma.decisionReason.update({
      where: { name },
      data,
    });
  },

  delete: async (name: string) => {
    return prisma.decisionReason.delete({
      where: { name },
    });
  },
};
