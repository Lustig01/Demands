import { Request, Response } from "express";
import { demandService } from "../../services/request/demand.service";
import { projectService } from "../../services/request/project.service";
import { DemandType, DemandStatus } from "@prisma/client";

export const demandController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const demands = await demandService.findAll();
      res.json(demands);
    } catch (error) {
      console.error("demandController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch demands" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const demand = await demandService.findById(Number(req.params.id));
      if (!demand) {
        return res.status(404).json({ error: "Demand not found" });
      }
      res.json(demand);
    } catch (error) {
      console.error("demandController.getById error:", error);
      res.status(500).json({ error: "Failed to fetch demand" });
    }
  },

  getByFilters: async (req: Request, res: Response) => {
    try {
      const {
        project,
        resource,
        resourceService,
        location,
        base,
        environment,
        network,
        type,
        status,
      } = req.query;

      const demands = await demandService.findByFilters({
        projectName: project as string | undefined,
        resourceName: resource as string | undefined,
        resourceService: resourceService as string | undefined,
        locationId: location ? Number(location) : undefined,
        baseName: base as string | undefined,
        environmentName: environment as string | undefined,
        networkName: network as string | undefined,
        type: type as DemandType | undefined,
        status: status as DemandStatus | undefined,
      });
      res.json(demands);
    } catch (error) {
      console.error("demandController.getByFilters error:", error);
      res.status(500).json({ error: "Failed to fetch demands" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const {
        projectName,
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId,
        type,
        clusterName,
      } = req.body;

      // Validate: clusterName is required if type is Extention
      if (type === DemandType.Extension && !clusterName) {
        return res.status(400).json({ error: "clusterName is required for Extention demands" });
      }

      // If locationId is not provided, use project's locationId
      let finalLocationId = locationId;
      if (!finalLocationId) {
        const project = await projectService.findByName(projectName);
        if (!project) {
          return res.status(400).json({ error: "Project not found" });
        }
        finalLocationId = project.locationId;
      }

      const demand = await demandService.create({
        projectName,
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId: finalLocationId,
        type,
        clusterName: type === DemandType.Extension ? clusterName : undefined,
      });
      res.status(201).json(demand);
    } catch (error) {
      console.error("demandController.create error:", error);
      res.status(400).json({ error: "Failed to create demand" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const {
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId,
        type,
        clusterName,
      } = req.body;

      // If updating type to Extention, clusterName is required
      if (type === DemandType.Extension && !clusterName) {
        const existingDemand = await demandService.findById(Number(req.params.id));
        if (!existingDemand?.clusterName) {
          return res.status(400).json({ error: "clusterName is required for Extention demands" });
        }
      }

      const demand = await demandService.update(Number(req.params.id), {
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId,
        type,
        clusterName,
      });
      res.json(demand);
    } catch (error) {
      console.error("demandController.update error:", error);
      res.status(400).json({ error: "Failed to update demand" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await demandService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("demandController.delete error:", error);
      res.status(400).json({ error: "Failed to delete demand" });
    }
  },

  reject: async (req: Request, res: Response) => {
    try {
      const demand = await demandService.reject(Number(req.params.id));
      res.json(demand);
    } catch (error) {
      console.error("demandController.reject error:", error);
      res.status(400).json({ error: "Failed to reject demand" });
    }
  },

  approve: async (req: Request, res: Response) => {
    try {
      const { status, approvedValue } = req.body;

      // Validate status
      if (status !== DemandStatus.Approved && status !== DemandStatus.PartiallyApproved) {
        return res.status(400).json({ error: "status must be Approved or PartiallyApproved" });
      }

      // Validate: approvedValue is required if status is PartiallyApproved
      if (status === DemandStatus.PartiallyApproved && (approvedValue === undefined || approvedValue === null)) {
        return res.status(400).json({ error: "approvedValue is required for PartiallyApproved status" });
      }

      const demand = await demandService.approve(Number(req.params.id), {
        status,
        approvedValue: status === DemandStatus.PartiallyApproved ? approvedValue : undefined,
      });
      res.json(demand);
    } catch (error) {
      console.error("demandController.approve error:", error);
      res.status(400).json({ error: "Failed to approve demand" });
    }
  },
};
