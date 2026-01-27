import prisma from '../prisma/client';
import { RequestLine, RequestStatus } from '@prisma/client';

export const getRequestLinesByProjectId = async (projectId: string) => {
    return await prisma.requestLine.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
    });
};

export const createRequestLine = async (data: {
    projectId: string;
    resourceType: string;
    requestedQuantity: number;
    unit?: string;
    purpose?: string;
}) => {
    return await prisma.requestLine.create({
        data: {
            ...data,
            status: RequestStatus.PENDING
        },
    });
};

export const updateRequestLine = async (
    id: string,
    data: Partial<RequestLine>
) => {
    return await prisma.requestLine.update({
        where: { id },
        data,
    });
};

export const deleteRequestLine = async (id: string) => {
    return await prisma.requestLine.delete({
        where: { id },
    });
};
