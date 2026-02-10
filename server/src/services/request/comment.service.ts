import prisma from "../../lib/prisma";
import { NotFoundError } from "../../lib/errors";

export const commentService = {
  findByDemandId: async (demandId: number) => {
    return prisma.demandComment.findMany({
      where: { demandId },
      orderBy: { createdAt: "asc" },
    });
  },

  create: async (data: {
    demandId: number;
    content: string;
    createdBy: string;
    createdByName: string;
  }) => {
    const demand = await prisma.demand.findUnique({
      where: { id: data.demandId },
    });
    if (!demand) {
      throw new NotFoundError("Demand");
    }

    return prisma.demandComment.create({
      data,
    });
  },

  delete: async (id: number, createdBy?: string) => {
    const comment = await prisma.demandComment.findFirst({
      where: createdBy ? { id, createdBy } : { id },
    });
    if (!comment) {
      throw new NotFoundError("Comment");
    }
    return prisma.demandComment.delete({
      where: { id },
    });
  },
};
