import { Router } from "express";
import { serviceController } from "../../controllers/service/service.controller";
import { authenticate } from "../../middleware/openIdConnect";
import { requireAuth, requireRoles } from "../../middleware/authorization";

const requireModerator = requireRoles('admin', 'moderator');

const router = Router();

router.get("/", authenticate, requireAuth, serviceController.getAll);
router.get("/:name", authenticate, requireAuth, serviceController.getByName);
router.post("/", authenticate, requireModerator, serviceController.create);
router.put("/:name", authenticate, requireModerator, serviceController.update);
router.delete("/:name", authenticate, requireModerator, serviceController.delete);

export default router;
