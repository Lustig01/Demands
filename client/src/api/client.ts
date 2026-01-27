import { Project } from '../types';

const API_URL = 'http://localhost:3000/api';

export const fetchProjects = async (): Promise<Project[]> => {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return response.json();
};

export const fetchProject = async (id: string): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    return response.json();
};

export const createProject = async (project: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
    });
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return response.json();
};

export const deleteProject = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete project');
    }
};
