import { Router } from "express";
import { projectTypeOptionController } from "../../controllers/settings/projectTypeOption.controller";
import { authenticate } from "../../middleware/openIdConnect";
import { requireAuth, requireAdmin } from "../../middleware/authorization";

const router = Router();

router.get("/", authenticate, requireAuth, projectTypeOptionController.getAll);
router.get("/:name", authenticate, requireAuth, projectTypeOptionController.getByName);
router.post("/", authenticate, requireAdmin, projectTypeOptionController.create);
router.put("/:name", authenticate, requireAdmin, projectTypeOptionController.update);
router.delete("/:name", authenticate, requireAdmin, projectTypeOptionController.delete);

export default router;
