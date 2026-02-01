import { Request, Response } from "express";
import { projectTypeOptionService } from "../../services/settings/projectTypeOption.service";

export const projectTypeOptionController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const options = await projectTypeOptionService.findAll();
      res.json(options);
    } catch (error) {
      console.error("projectTypeOptionController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch project type options" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const option = await projectTypeOptionService.findByName(req.params.name);
      if (!option) {
        return res.status(404).json({ error: "Project type option not found" });
      }
      res.json(option);
    } catch (error) {
      console.error("projectTypeOptionController.getByName error:", error);
      res.status(500).json({ error: "Failed to fetch project type option" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, displayName, sortOrder, isActive } = req.body;
      const option = await projectTypeOptionService.create({ name, displayName, sortOrder, isActive });
      res.status(201).json(option);
    } catch (error) {
      console.error("projectTypeOptionController.create error:", error);
      res.status(400).json({ error: "Failed to create project type option" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { name, displayName, sortOrder, isActive } = req.body;
      const option = await projectTypeOptionService.update(req.params.name, { name, displayName, sortOrder, isActive });
      res.json(option);
    } catch (error) {
      console.error("projectTypeOptionController.update error:", error);
      res.status(400).json({ error: "Failed to update project type option" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await projectTypeOptionService.delete(req.params.name);
      res.status(204).send();
    } catch (error) {
      console.error("projectTypeOptionController.delete error:", error);
      res.status(400).json({ error: "Failed to delete project type option" });
    }
  },
};
