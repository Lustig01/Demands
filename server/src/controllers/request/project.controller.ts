import { Request, Response } from "express";
import { projectService } from "../../services/request/project.service";
import { ProjectType, Median } from "@prisma/client";
import { settings } from "../../lib/settings";
import { NotFoundError } from "../../lib/errors";

function getUserContext(req: Request) {
  const user = req.auth!.user;
  const isPrivileged = user.hasAnyRole([
    settings.authAdminGroup,
    settings.authModeratorGroup,
  ]);
  return {
    username: user.username,
    fullName: user.fullName ?? user.username ?? user.email ?? "Unknown",
    isPrivileged,
  };
}

export const projectController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await projectService.findAll(
        isPrivileged ? undefined : username,
        { page, limit }
      );
      res.json(result);
    } catch (error) {
      console.error("projectController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  },

  getByFilters: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const { name, page: pageQuery, limit: limitQuery } = req.query;

      const page = Number(pageQuery) || 1;
      const limit = Number(limitQuery) || 10;

      const result = await projectService.findByFilters(
        {
          name: name as string | undefined,
          createdBy: isPrivileged ? undefined : username,
        },
        { page, limit }
      );
      res.json(result);
    } catch (error) {
      console.error("projectController.getByFilters error:", error);
      res.status(500).json({ error: "Failed to fetch projects by filters" });
    }
  },

  getByName: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const project = await projectService.findByName(req.params.name);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (!isPrivileged && project.createdBy !== username) {
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
      const { username, fullName } = getUserContext(req);
      const { name, purpose, type, kind, locationId, year, median } = req.body;

      // Validate: year and median are required if type is Semiannual
      if (type === ProjectType.Semiannual) {
        if (year === undefined || year === null) {
          return res
            .status(400)
            .json({ error: "year is required for Semiannual projects" });
        }
        if (!median) {
          return res
            .status(400)
            .json({ error: "median is required for Semiannual projects" });
        }
      }

      const project = await projectService.create({
        name,
        purpose,
        type,
        kindName: kind,
        locationId,
        year: type === ProjectType.Semiannual ? year : undefined,
        median: type === ProjectType.Semiannual ? median : undefined,
        createdBy: username,
        createdByName: fullName,
      });
      res.status(201).json(project);
    } catch (error) {
      console.error("projectController.create error:", error);
      res.status(400).json({ error: "Failed to create project" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const { purpose, type, kind, locationId, year, median } = req.body;

      // If type is being updated to Semiannual, validate year and median
      if (type === ProjectType.Semiannual) {
        if (year === undefined || year === null) {
          return res
            .status(400)
            .json({ error: "year is required for Semiannual projects" });
        }
        if (!median) {
          return res
            .status(400)
            .json({ error: "median is required for Semiannual projects" });
        }
      }

      // If type is Emergency, clear year and median
      const updateData: {
        purpose?: string;
        type?: ProjectType;
        kindName?: string;
        locationId?: number;
        year?: number | null;
        median?: Median | null;
      } = {};

      if (purpose !== undefined) updateData.purpose = purpose;
      if (type !== undefined) updateData.type = type;
      if (kind !== undefined) updateData.kindName = kind;
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

      const project = await projectService.update(
        req.params.name,
        updateData,
        isPrivileged ? undefined : username
      );
      res.json(project);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Project not found" });
      }
      console.error("projectController.update error:", error);
      res.status(400).json({ error: "Failed to update project" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      await projectService.delete(
        req.params.name,
        isPrivileged ? undefined : username
      );
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Project not found" });
      }
      console.error("projectController.delete error:", error);
      res.status(400).json({ error: "Failed to delete project" });
    }
  },
};
