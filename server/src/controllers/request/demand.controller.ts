import { Request, Response } from "express";
import { demandService } from "../../services/request/demand.service";
import { projectService } from "../../services/request/project.service";
import { DemandType, DemandStatus, ProjectType, Median } from "@prisma/client";
import { settings } from "../../lib/settings";
import { NotFoundError } from "../../lib/errors";
import prisma from "../../lib/prisma";

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

export const demandController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await demandService.findAll(
        isPrivileged ? undefined : username,
        { page, limit }
      );
      res.json(result);
    } catch (error) {
      console.error("demandController.getAll error:", error);
      res.status(500).json({ error: "Failed to fetch demands" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const demand = await demandService.findById(Number(req.params.id));
      if (!demand) {
        return res.status(404).json({ error: "Demand not found" });
      }
      if (!isPrivileged && demand.createdBy !== username) {
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
      const { username, isPrivileged } = getUserContext(req);
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
        projectType,
        median,
        year,
        relatedTo,
        emergencyOption,
        page: pageQuery,
        limit: limitQuery,
      } = req.query;

      const page = Number(pageQuery) || 1;
      const limit = Number(limitQuery) || 10;

      const result = await demandService.findByFilters(
        {
          projectName: project as string | undefined,
          resourceName: resource as string | undefined,
          resourceService: resourceService as string | undefined,
          locationId: location ? Number(location) : undefined,
          baseName: base as string | undefined,
          environmentName: environment as string | undefined,
          networkName: network as string | undefined,
          type: type as DemandType | undefined,
          status: status as DemandStatus | undefined,
          createdBy: isPrivileged ? undefined : username,
          projectType: projectType as ProjectType | undefined,
          projectMedian: median as Median | undefined,
          projectYear: year ? Number(year) : undefined,
          projectRelatedTo: relatedTo as string | undefined,
          projectEmergencyOption: emergencyOption as string | undefined,
        },
        { page, limit }
      );
      res.json(result);
    } catch (error) {
      console.error("demandController.getByFilters error:", error);
      res.status(500).json({ error: "Failed to fetch demands" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { username, fullName, isPrivileged } = getUserContext(req);
      const {
        projectName,
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId,
        type,
        clusterName,
        centerName,
        branchName,
        sectionName,
      } = req.body;

      // Validate: clusterName is required if type is Extention
      if (type === DemandType.Extension && !clusterName) {
        return res.status(400).json({ error: "clusterName is required for Extention demands" });
      }

      // Verify the user has access to the project
      const project = await projectService.findByName(projectName);
      if (!project) {
        return res.status(400).json({ error: "Project not found" });
      }
      if (!isPrivileged && project.createdBy !== username) {
        return res.status(400).json({ error: "Project not found" });
      }

      // If locationId is not provided, use project's locationId
      const finalLocationId = locationId || project.locationId;

      // Validate: service must be active
      const service = await prisma.service.findUnique({
        where: { name: serviceName },
      });
      if (!service) {
        return res.status(400).json({ error: "Service not found" });
      }
      if (!service.isActive) {
        return res.status(400).json({ error: "Service is not active" });
      }

      // Validate: resource must be active
      const resource = await prisma.resource.findUnique({
        where: { name_serviceName: { name: resourceName, serviceName: resourceService } },
      });
      if (!resource) {
        return res.status(400).json({ error: "Resource not found" });
      }
      if (!resource.isActive) {
        return res.status(400).json({ error: "Resource is not active" });
      }

      // Validate: location and its related entities must be active
      const location = await prisma.location.findUnique({
        where: { id: finalLocationId },
        include: { base: true, environment: true, network: true },
      });
      if (!location) {
        return res.status(400).json({ error: "Location not found" });
      }
      if (!location.isActive) {
        return res.status(400).json({ error: "Location is not active" });
      }
      if (!location.base.isActive) {
        return res.status(400).json({ error: "Base is not active" });
      }
      if (!location.environment.isActive) {
        return res.status(400).json({ error: "Environment is not active" });
      }
      if (!location.network.isActive) {
        return res.status(400).json({ error: "Network is not active" });
      }

      // If organization fields not provided, inherit from project
      const finalCenterName = centerName || project.centerName;
      const finalBranchName = branchName || project.branchName;
      const finalSectionName = sectionName || project.sectionName;

      // Validate: center must be active
      const center = await prisma.center.findUnique({
        where: { name: finalCenterName },
      });
      if (!center) {
        return res.status(400).json({ error: "Center not found" });
      }
      if (!center.isActive) {
        return res.status(400).json({ error: "Center is not active" });
      }

      // Validate: branch must be active
      const branch = await prisma.branch.findUnique({
        where: { name_centerName: { name: finalBranchName, centerName: finalCenterName } },
      });
      if (!branch) {
        return res.status(400).json({ error: "Branch not found" });
      }
      if (!branch.isActive) {
        return res.status(400).json({ error: "Branch is not active" });
      }

      // Validate: section must be active
      const sectionEntity = await prisma.section.findUnique({
        where: { name_branchName_branchCenter: { name: finalSectionName, branchName: finalBranchName, branchCenter: finalCenterName } },
      });
      if (!sectionEntity) {
        return res.status(400).json({ error: "Section not found" });
      }
      if (!sectionEntity.isActive) {
        return res.status(400).json({ error: "Section is not active" });
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
        centerName: finalCenterName,
        branchName: finalBranchName,
        sectionName: finalSectionName,
        createdBy: username,
        createdByName: fullName,
      });
      res.status(201).json(demand);
    } catch (error) {
      console.error("demandController.create error:", error);
      res.status(400).json({ error: "Failed to create demand" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const {
        serviceName,
        resourceName,
        resourceService,
        value,
        locationId,
        type,
        clusterName,
        centerName,
        branchName,
        sectionName,
      } = req.body;

      // If updating type to Extention, clusterName is required
      if (type === DemandType.Extension && !clusterName) {
        const existingDemand = await demandService.findById(Number(req.params.id));
        if (!existingDemand?.clusterName) {
          return res.status(400).json({ error: "clusterName is required for Extention demands" });
        }
      }

      // Fetch current demand to compare values
      const currentDemand = await demandService.findById(Number(req.params.id));
      if (!currentDemand) {
        return res.status(404).json({ error: "Demand not found" });
      }

      // Validate organization fields if provided
      if (centerName) {
        const center = await prisma.center.findUnique({ where: { name: centerName } });
        if (!center) {
          return res.status(400).json({ error: "Center not found" });
        }
        // Only validate active status if the value is changing
        if (!center.isActive && center.name !== currentDemand.centerName) {
          return res.status(400).json({ error: "Center is not active" });
        }
      }

      const targetCenter = centerName || currentDemand.centerName;

      if (branchName) {
        const branch = await prisma.branch.findUnique({
          where: { name_centerName: { name: branchName, centerName: targetCenter } },
        });
        if (!branch) {
          return res.status(400).json({ error: "Branch not found" });
        }
        // Only validate active status if the value is changing
        if (!branch.isActive && branch.name !== currentDemand.branchName) {
          return res.status(400).json({ error: "Branch is not active" });
        }
      }

      const targetBranch = branchName || currentDemand.branchName;

      if (sectionName) {
        const sectionEntity = await prisma.section.findUnique({
          where: { name_branchName_branchCenter: { name: sectionName, branchName: targetBranch, branchCenter: targetCenter } },
        });
        if (!sectionEntity) {
          return res.status(400).json({ error: "Section not found" });
        }
        // Only validate active status if the value is changing
        if (!sectionEntity.isActive && sectionEntity.name !== currentDemand.sectionName) {
          return res.status(400).json({ error: "Section is not active" });
        }
      }

      const demand = await demandService.update(
        Number(req.params.id),
        {
          serviceName,
          resourceName,
          resourceService,
          value,
          locationId,
          type,
          clusterName,
          centerName,
          branchName,
          sectionName,
        },
        isPrivileged ? undefined : username
      );
      res.json(demand);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Demand not found" });
      }
      if (error instanceof Error && error.message.includes("pending")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("demandController.update error:", error);
      res.status(400).json({ error: "Failed to update demand" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      await demandService.delete(
        Number(req.params.id),
        isPrivileged ? undefined : username
      );
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Demand not found" });
      }
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

  cancel: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const demand = await demandService.cancel(
        Number(req.params.id),
        isPrivileged ? undefined : username
      );
      res.json(demand);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Demand not found" });
      }
      if (error instanceof Error && error.message.includes("pending")) {
        return res.status(400).json({ error: error.message });
      }
      console.error("demandController.cancel error:", error);
      res.status(400).json({ error: "Failed to cancel demand" });
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
