import { Request, Response } from "express";
import { serviceService } from "../../services/service/service.service";
import { settings } from "../../lib/settings";

function getUserContext(req: Request) {
  const user = req.auth!.user;
  return {
    username: user.username,
    isAdmin: user.hasRole(settings.authAdminGroup),
    isModerator: user.hasRole(settings.authModeratorGroup),
  };
}

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
      const { username, isModerator } = getUserContext(req);
      const { name, moderators: bodyModerators } = req.body;

      // Collect usernames to validate from body
      const usernamesToValidate: string[] = [];
      if (Array.isArray(bodyModerators)) {
        for (const mod of bodyModerators) {
          if (typeof mod === "string" && !usernamesToValidate.includes(mod)) {
            usernamesToValidate.push(mod);
          }
        }
      }

      // Validate that body moderators exist and have the moderator role
      if (usernamesToValidate.length > 0) {
        const { invalid } = await serviceService.validateModerators(usernamesToValidate);
        if (invalid.length > 0) {
          return res.status(400).json({
            error: "Invalid moderators",
            invalidUsernames: invalid,
          });
        }
      }

      // Build final moderators list
      const moderators: string[] = [];

      // Auto-add creator if they have moderator role
      if (isModerator && username) {
        moderators.push(username);
      }

      // Add validated moderators from request body
      for (const mod of usernamesToValidate) {
        if (!moderators.includes(mod)) {
          moderators.push(mod);
        }
      }

      const service = await serviceService.create({ name, moderators });
      res.status(201).json(service);
    } catch (error) {
      console.error("serviceController.create error:", error);
      res.status(400).json({ error: "Failed to create service" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { username, isAdmin } = getUserContext(req);
      const serviceName = req.params.name;

      // Check authorization: admin OR in service's moderator list
      if (!isAdmin) {
        const isMod = username
          ? await serviceService.isUserModerator(serviceName, username)
          : false;
        if (!isMod) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }

      const { name: newName, moderators, isActive } = req.body;

      // Validate moderators if being updated
      if (Array.isArray(moderators) && moderators.length > 0) {
        const { invalid } = await serviceService.validateModerators(moderators);
        if (invalid.length > 0) {
          return res.status(400).json({
            error: "Invalid moderators",
            invalidUsernames: invalid,
          });
        }
      }

      const service = await serviceService.update(serviceName, {
        name: newName,
        moderators,
        isActive,
      });
      res.json(service);
    } catch (error) {
      console.error("serviceController.update error:", error);
      res.status(400).json({ error: "Failed to update service" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { username, isAdmin } = getUserContext(req);
      const serviceName = req.params.name;

      // Check authorization: admin OR in service's moderator list
      if (!isAdmin) {
        const isMod = username
          ? await serviceService.isUserModerator(serviceName, username)
          : false;
        if (!isMod) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }

      await serviceService.delete(serviceName);
      res.status(204).send();
    } catch (error) {
      console.error("serviceController.delete error:", error);
      res.status(400).json({ error: "Failed to delete service" });
    }
  },
};
