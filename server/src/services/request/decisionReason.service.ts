import prisma from "../../lib/prisma";

export const decisionReasonService = {
    findAll: async () => {
        return prisma.decisionReason.findMany();
    },

    findByName: async (name: string) => {
        return prisma.decisionReason.findUnique({
            where: { name },
        });
    },

    create: async (data: { name: string; displayName: string }) => {
        return prisma.decisionReason.create({
            data,
        });
    },

    update: async (
        name: string,
        data: { displayName?: string }
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
