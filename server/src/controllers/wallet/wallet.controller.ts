import { Request, Response } from "express";
import { walletService } from "../../services/wallet/wallet.service";

export const walletController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const wallets = await walletService.findAll();
      res.json(wallets);
    } catch (error) {
      console.error("walletController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch wallets" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const wallet = await walletService.findById(Number(req.params.id));
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      console.error("walletController.getById error:", error);
      res.status(500).json({ error: "Failed to fetch wallet" });
    }
  },

  getByFilters: async (req: Request, res: Response) => {
    try {
      const { centerName, baseName, environmentName, networkName, resourceName, resourceService } = req.query;
      const wallets = await walletService.findByFilters({
        centerName: centerName as string | undefined,
        baseName: baseName as string | undefined,
        environmentName: environmentName as string | undefined,
        networkName: networkName as string | undefined,
        resourceName: resourceName as string | undefined,
        resourceService: resourceService as string | undefined,
      });
      res.json(wallets);
    } catch (error) {
      console.error("walletController.getByFilters error:", error);
      res.status(500).json({ error: "Failed to fetch wallets" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { centerName, capacityId, value } = req.body;
      const wallet = await walletService.create(centerName, capacityId, value);
      res.status(201).json(wallet);
    } catch (error) {
      console.error("walletController.create error:", error);
      res.status(400).json({ error: "Failed to create wallet" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { centerName, capacityId, value } = req.body;
      const wallet = await walletService.update(Number(req.params.id), { centerName, capacityId, value });
      res.json(wallet);
    } catch (error) {
      console.error("walletController.update error:", error);
      res.status(400).json({ error: "Failed to update wallet" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await walletService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("walletController.delete error:", error);
      res.status(400).json({ error: "Failed to delete wallet" });
    }
  },
};
