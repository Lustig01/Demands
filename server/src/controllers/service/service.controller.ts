import { Request, Response } from "express";
import { serviceService } from "../../services/service/service.service";

export const serviceController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const services = await serviceService.findAll();
      res.json(services);
    } catch (error) {
      console.error("serviceController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const service = await serviceService.findByName(req.params.name);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("serviceController.getByName error:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const service = await serviceService.create(name);
      res.status(201).json(service);
    } catch (error) {
      console.error("serviceController.create error:", error);
      res.status(400).json({ error: "Failed to create service" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { name: newName } = req.body;
      const service = await serviceService.update(req.params.name, newName);
      res.json(service);
    } catch (error) {
      console.error("serviceController.update error:", error);
      res.status(400).json({ error: "Failed to update service" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await serviceService.delete(req.params.name);
      res.status(204).send();
    } catch (error) {
      console.error("serviceController.delete error:", error);
      res.status(400).json({ error: "Failed to delete service" });
    }
  },
};
