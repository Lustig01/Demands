import { Request, Response } from "express";
import { locationService } from "../../services/location/location.service";

export const locationController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const locations = await locationService.findAll();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const location = await locationService.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  },

  getByComposite: async (req: Request, res: Response) => {
    try {
      const { baseName, environmentName, networkName } = req.params;
      const location = await locationService.findByComposite(
        baseName,
        environmentName,
        networkName
      );
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { baseName, environmentName, networkName } = req.body;
      const location = await locationService.create(
        baseName,
        environmentName,
        networkName
      );
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: "Failed to create location" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { baseName, environmentName, networkName } = req.body;
      const location = await locationService.update(req.params.id, {
        baseName,
        environmentName,
        networkName,
      });
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Failed to update location" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await locationService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete location" });
    }
  },
};
