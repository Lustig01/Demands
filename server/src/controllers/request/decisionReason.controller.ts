import { Request, Response } from "express";
import { decisionReasonService } from "../../services/request/decisionReason.service";

export const decisionReasonController = {
    getAll: async (_req: Request, res: Response) => {
        try {
            const decisionReasons = await decisionReasonService.findAll();
            res.json(decisionReasons);
        } catch (error) {
            console.error("decisionReasonController.getAll error:", error);
            res.status(500).json({ error: "Failed to fetch decision reasons" });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { name, displayName } = req.body;
            if (!name || !displayName) {
                return res.status(400).json({ error: "Name and Display Name are required" });
            }

            const existing = await decisionReasonService.findByName(name);
            if (existing) {
                return res.status(409).json({ error: "Decision reason already exists" });
            }

            const decisionReason = await decisionReasonService.create({ name, displayName });
            res.status(201).json(decisionReason);
        } catch (error) {
            console.error("decisionReasonController.create error:", error);
            res.status(500).json({ error: "Failed to create decision reason" });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { displayName } = req.body;
            const decisionReason = await decisionReasonService.update(req.params.name, { displayName });
            res.json(decisionReason);
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
