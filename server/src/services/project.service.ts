import prisma from '../prisma/client';
import { Project, ProjectStatus } from '@prisma/client';

export const getAllProjects = async () => {
    return await prisma.project.findMany({
        include: {
            requestLines: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
};

export const getProjectById = async (id: string) => {
    return await prisma.project.findUnique({
        where: { id },
        include: {
            requestLines: true,
        },
    });
};

export const createProject = async (data: {
    name: string;
    description?: string;
    ownerId: string;
    snLink?: string;
    center?: string;
    branch?: string;
    mador?: string;
    dc?: string;
    network?: string;
    environment?: string;
}) => {
    return await prisma.project.create({
        data: {
            ...data,
            status: ProjectStatus.IN_PROCESS
        },
    });
};

export const updateProject = async (
    id: string,
    data: Partial<Project>
) => {
    return await prisma.project.update({
        where: { id },
        data,
    });
};

export const deleteProject = async (id: string) => {
    return await prisma.project.delete({
        where: { id },
    });
};
