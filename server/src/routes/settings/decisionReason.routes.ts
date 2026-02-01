import { Router } from "express";
import { decisionReasonController } from "../../controllers/settings/decisionReason.controller";
import { authenticate } from "../../middleware/openIdConnect";
import { requireAuth, requireAdmin } from "../../middleware/authorization";

const router = Router();

router.get("/", authenticate, requireAuth, decisionReasonController.getAll);
router.get("/:name", authenticate, requireAuth, decisionReasonController.getByName);
router.post("/", authenticate, requireAdmin, decisionReasonController.create);
router.put("/:name", authenticate, requireAdmin, decisionReasonController.update);
router.delete("/:name", authenticate, requireAdmin, decisionReasonController.delete);

export default router;
