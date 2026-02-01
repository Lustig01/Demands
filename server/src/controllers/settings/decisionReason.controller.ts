import { Request, Response } from "express";
import { decisionReasonService } from "../../services/settings/decisionReason.service";

export const decisionReasonController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const reasons = await decisionReasonService.findAll();
      res.json(reasons);
    } catch (error) {
      console.error("decisionReasonController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch decision reasons" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const reason = await decisionReasonService.findByName(req.params.name);
      if (!reason) {
        return res.status(404).json({ error: "Decision reason not found" });
      }
      res.json(reason);
    } catch (error) {
      console.error("decisionReasonController.getByName error:", error);
      res.status(500).json({ error: "Failed to fetch decision reason" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, displayName, sortOrder, isActive } = req.body;
      const reason = await decisionReasonService.create({ name, displayName, sortOrder, isActive });
      res.status(201).json(reason);
    } catch (error) {
      console.error("decisionReasonController.create error:", error);
      res.status(400).json({ error: "Failed to create decision reason" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { name, displayName, sortOrder, isActive } = req.body;
      const reason = await decisionReasonService.update(req.params.name, { name, displayName, sortOrder, isActive });
      res.json(reason);
    } catch (error) {
      console.error("decisionReasonController.update error:", error);
      res.status(400).json({ error: "Failed to update decision reason" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await decisionReasonService.delete(req.params.name);
      res.status(204).send();
    } catch (error) {
      console.error("decisionReasonController.delete error:", error);
      res.status(400).json({ error: "Failed to delete decision reason" });
    }
  },
};
