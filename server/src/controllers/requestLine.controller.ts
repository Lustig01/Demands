import { Request, Response } from 'express';
import * as requestLineService from '../services/requestLine.service';

export const getProjectRequestLines = async (req: Request, res: Response) => {
    try {
        const lines = await requestLineService.getRequestLinesByProjectId(req.params.projectId as string);
        res.json(lines);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch request lines' });
    }
};

export const createRequestLine = async (req: Request, res: Response) => {
    try {
        const line = await requestLineService.createRequestLine({
            ...req.body,
            projectId: req.params.projectId as string
        });
        res.status(201).json(line);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create request line' });
    }
};

export const updateRequestLine = async (req: Request, res: Response) => {
    try {
        const line = await requestLineService.updateRequestLine(req.params.id as string, req.body);
        res.json(line);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update request line' });
    }
};

export const deleteRequestLine = async (req: Request, res: Response) => {
    try {
        await requestLineService.deleteRequestLine(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete request line' });
    }
};
