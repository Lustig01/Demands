import { Request, Response } from "express";
import { projectService } from "../../services/request/project.service";
import { ProjectType, ProjectKind, Median } from "@prisma/client";

export const projectController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const projects = await projectService.findAll();
      res.json(projects);
    } catch (error) {
      console.error("projectController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const project = await projectService.findByName(req.params.name);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("projectController.getByName error:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, purpose, type, kind, locationId, year, median } = req.body;

      // Validate: year and median are required if type is Semiannual
      if (type === ProjectType.Semiannual) {
        if (year === undefined || year === null) {
          return res.status(400).json({ error: "year is required for Semiannual projects" });
        }
        if (!median) {
          return res.status(400).json({ error: "median is required for Semiannual projects" });
        }
      }

      const project = await projectService.create({
        name,
        purpose,
        type,
        kind,
        locationId,
        year: type === ProjectType.Semiannual ? year : undefined,
        median: type === ProjectType.Semiannual ? median : undefined,
      });
      res.status(201).json(project);
    } catch (error) {
      console.error("projectController.create error:", error);
      res.status(400).json({ error: "Failed to create project" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { purpose, type, kind, locationId, year, median } = req.body;

      // If type is being updated to Semiannual, validate year and median
      if (type === ProjectType.Semiannual) {
        if (year === undefined || year === null) {
          return res.status(400).json({ error: "year is required for Semiannual projects" });
        }
        if (!median) {
          return res.status(400).json({ error: "median is required for Semiannual projects" });
        }
      }

      // If type is Emergency, clear year and median
      const updateData: {
        purpose?: string;
        type?: ProjectType;
        kind?: ProjectKind;
        locationId?: number;
        year?: number | null;
        median?: Median | null;
      } = {};

      if (purpose !== undefined) updateData.purpose = purpose;
      if (type !== undefined) updateData.type = type;
      if (kind !== undefined) updateData.kind = kind;
      if (locationId !== undefined) updateData.locationId = locationId;

      if (type === ProjectType.Emergency) {
        updateData.year = null;
        updateData.median = null;
      } else if (type === ProjectType.Semiannual) {
        updateData.year = year;
        updateData.median = median;
      } else if (year !== undefined) {
        updateData.year = year;
      }
      if (median !== undefined && type !== ProjectType.Emergency) {
        updateData.median = median;
      }

      const project = await projectService.update(req.params.name, updateData);
      res.json(project);
    } catch (error) {
      console.error("projectController.update error:", error);
      res.status(400).json({ error: "Failed to update project" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await projectService.delete(req.params.name);
      res.status(204).send();
    } catch (error) {
      console.error("projectController.delete error:", error);
      res.status(400).json({ error: "Failed to delete project" });
    }
  },
};
