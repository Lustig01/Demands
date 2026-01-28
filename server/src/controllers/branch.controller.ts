import { Request, Response } from "express";
import { branchService } from "../services/branch.service";

export const branchController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const branches = await branchService.findAll();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branches" });
    }
  },

  getByKey: async (req: Request, res: Response) => {
    try {
      const { centerName, name } = req.params;
      const branch = await branchService.findByKey(name, centerName);
      if (!branch) {
        return res.status(404).json({ error: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branch" });
    }
  },

  getByCenter: async (req: Request, res: Response) => {
    try {
      const branches = await branchService.findByCenter(req.params.centerName);
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branches" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, centerName } = req.body;
      const branch = await branchService.create(name, centerName);
      res.status(201).json(branch);
    } catch (error) {
      res.status(400).json({ error: "Failed to create branch" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { centerName, name } = req.params;
      const { name: newName } = req.body;
      const branch = await branchService.update(name, centerName, newName);
      res.json(branch);
    } catch (error) {
      res.status(400).json({ error: "Failed to update branch" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { centerName, name } = req.params;
      await branchService.delete(name, centerName);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete branch" });
    }
  },
};
