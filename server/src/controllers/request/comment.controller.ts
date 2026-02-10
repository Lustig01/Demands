import { Request, Response } from "express";
import { commentService } from "../../services/request/comment.service";
import { demandService } from "../../services/request/demand.service";
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

export const commentController = {
  getByDemandId: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const demandId = Number(req.params.demandId);

      const demand = await demandService.findById(demandId);
      if (!demand) {
        return res.status(404).json({ error: "Demand not found" });
      }
      if (!isPrivileged && demand.createdBy !== username) {
        return res.status(404).json({ error: "Demand not found" });
      }

      const comments = await commentService.findByDemandId(demandId);
      res.json(comments);
    } catch (error) {
      console.error("commentController.getByDemandId error:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { username, fullName, isPrivileged } = getUserContext(req);
      const demandId = Number(req.params.demandId);
      const { content } = req.body;

      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Content is required" });
      }

      const demand = await demandService.findById(demandId);
      if (!demand) {
        return res.status(404).json({ error: "Demand not found" });
      }
      if (!isPrivileged && demand.createdBy !== username) {
        return res.status(404).json({ error: "Demand not found" });
      }

      const comment = await commentService.create({
        demandId,
        content: content.trim(),
        createdBy: username,
        createdByName: fullName,
      });
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Demand not found" });
      }
      console.error("commentController.create error:", error);
      res.status(400).json({ error: "Failed to create comment" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { username, isPrivileged } = getUserContext(req);
      const commentId = Number(req.params.id);

      await commentService.delete(
        commentId,
        isPrivileged ? undefined : username
      );
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: "Comment not found" });
      }
      console.error("commentController.delete error:", error);
      res.status(400).json({ error: "Failed to delete comment" });
    }
  },
};
