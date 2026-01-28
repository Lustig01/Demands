import { Request, Response } from "express";
import { capacityService } from "../../services/service/capacity.service";

export const capacityController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const capacities = await capacityService.findAll();
      res.json(capacities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch capacities" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const capacity = await capacityService.findById(req.params.id);
      if (!capacity) {
        return res.status(404).json({ error: "Capacity not found" });
      }
      res.json(capacity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch capacity" });
    }
  },

  getByLocation: async (req: Request, res: Response) => {
    try {
      const capacities = await capacityService.findByLocation(req.params.locationId);
      res.json(capacities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch capacities" });
    }
  },

  getByResource: async (req: Request, res: Response) => {
    try {
      const { serviceName, resourceName } = req.params;
      const capacities = await capacityService.findByResource(resourceName, serviceName);
      res.json(capacities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch capacities" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { locationId, resourceName, resourceService, value } = req.body;
      const capacity = await capacityService.create(
        locationId,
        resourceName,
        resourceService,
        value
      );
      res.status(201).json(capacity);
    } catch (error) {
      res.status(400).json({ error: "Failed to create capacity" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { value } = req.body;
      const capacity = await capacityService.update(req.params.id, value);
      res.json(capacity);
    } catch (error) {
      res.status(400).json({ error: "Failed to update capacity" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await capacityService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete capacity" });
    }
  },
};
