import { Request, Response } from "express";
import { centerService } from "../services/center.service";

export const centerController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const centers = await centerService.findAll();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch centers" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const center = await centerService.findByName(req.params.name);
      if (!center) {
        return res.status(404).json({ error: "Center not found" });
      }
      res.json(center);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch center" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const center = await centerService.create(name);
      res.status(201).json(center);
    } catch (error) {
      res.status(400).json({ error: "Failed to create center" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { name: newName } = req.body;
      const center = await centerService.update(req.params.name, newName);
      res.json(center);
    } catch (error) {
      res.status(400).json({ error: "Failed to update center" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await centerService.delete(req.params.name);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete center" });
    }
  },
};
