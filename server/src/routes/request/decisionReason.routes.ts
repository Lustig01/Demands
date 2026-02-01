import { Router } from "express";
import { decisionReasonController } from "../../controllers/request/decisionReason.controller";
import { authenticate } from "../../middleware/openIdConnect";
import { requireAuth, requireRoles, requireAdmin } from "../../middleware/authorization";
import { settings } from "../../lib/settings";

const router = Router();

router.get("/", authenticate, requireAuth, decisionReasonController.getAll);
router.post(
    "/",
    authenticate,
    requireRoles(settings.authAdminGroup, settings.authModeratorGroup),
    decisionReasonController.create
);
router.patch("/:name", authenticate, requireAdmin, decisionReasonController.update);
router.delete("/:name", authenticate, requireAdmin, decisionReasonController.delete);

export default router;
