import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

export const getProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.getProjectById(req.params.id as string);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.updateProject(req.params.id as string, req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        await projectService.deleteProject(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
